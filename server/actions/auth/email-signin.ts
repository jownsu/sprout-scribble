"use server";

/* DB */
import { db } from "@/server";
import { twoFactorTokens, users } from "@/server/schema";
import { LoginSchema } from "@/types/login-schema";

/* PLUGINS */
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { AuthError } from "next-auth";

/* ACTIONS */
import { signIn } from "@/server/auth";
import { generateEmailVerificationToken, generateTwoFactorToken, getTwoFactorTokenByEmail } from "@/server/actions/auth/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/server/actions/auth/email";

const action = createSafeActionClient();

/* Sign in user or send verification email if user has two factor authentication */
export const emailSignIn = action
	.schema(LoginSchema)
	.action(async ({ parsedInput: { email, password, code } }) => {
		try {

			/* Validate the user if existing */
			const existing_user = await db.query.users.findFirst({
				where: eq(users.email, email)
			});

			if (existing_user?.email !== email) {
				return {
					status: false,
					message: "User not found"
				};
			}

			/* Send verification to email if the user is not email verified */
			if(!existing_user.emailVerified){
				const [verification] = await generateEmailVerificationToken(existing_user.email);
				const send_response = await sendVerificationEmail(verification.email, verification.token);
				
				return {
					status: send_response?.status,
					message: send_response?.message
				};
			}

			/* Check if user enabled two factor authentication */
			if(existing_user.twoFactorEnabled && existing_user.email){ 
				/* Validate code if passed on payload */
				if(code){
					const two_factor_token = await getTwoFactorTokenByEmail(existing_user.email);

					/* Return false if code and token does not match */
					if(!twoFactorTokens || two_factor_token?.token !== code){
						return {
							status: false,
							error: "Invalid Token"
						}
					}

					const has_expired = new Date(two_factor_token.expires) < new Date();

					/* Return false if the token is expired */
					if(has_expired){
						return {
							status: false,
							error: "Token has expired"
						}
					} 

					/* Delete token if the code is valid */
					await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, two_factor_token.id));
				}
				/* Generate code if not included on payload */
				else {
					/* TODO: Add additional checking for password match to prevent invalid credentials login. */
					const [two_factor] = await generateTwoFactorToken(existing_user.email);

					/* Return false if token was not generated */
					if(!two_factor){
						return {
							status: true,
							message: "Token not generated"
						}
					}

					/* Send the token on email */
					await sendTwoFactorTokenEmail(two_factor.email, two_factor.token);
					return {
						status: true,
						twoFactor: true,
						message: "Two factor token sent"
					}
				}
			}

			/* Will sign in the user */
			await signIn("credentials", {
				email,
				password,
				redirectTo: "/"
			});
		} 
		catch (error) {
			if(error instanceof AuthError){
				switch(error.type){
					case "CredentialsSignin":
						return {
							status: false,
							message: "Invalid Credentials"
						}
					default:
						return {
							status: false,
							message: "Something went wrong"
						}
				}
			}

			throw error;
		}
	});
