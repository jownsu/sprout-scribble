"use server";

import { db } from "@/server";
import { twoFactorTokens, users } from "@/server/schema";
import { LoginSchema } from "@/types/login-schema";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { signIn } from "../auth";
import { generateEmailVerificationToken, generateTwoFactorToken, getTwoFactorTokenByEmail } from "./tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "./email";
import { AuthError } from "next-auth";

const action = createSafeActionClient();

export const emailSignIn = action
	.schema(LoginSchema)
	.action(async ({ parsedInput: { email, password, code } }) => {
		try {
			/* Check if the user is in the database */
			const existingUser = await db.query.users.findFirst({
				where: eq(users.email, email)
			});


			/* Return error if no user */
			if (existingUser?.email !== email) {
				return {
					status: false,
					message: "User not found"
				};
			}

			/* Return error if user is not verified */
			if(!existingUser.emailVerified){
				const [verification] = await generateEmailVerificationToken(existingUser.email);
				const sendResponse = await sendVerificationEmail(verification.email, verification.token);
				
				return {
					status: sendResponse?.status,
					message: sendResponse?.message
				};
			}

			/* Check if user enabled two factor authentication */
			if(existingUser.twoFactorEnabled && existingUser.email){ 
				if(code){
					const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

					if(!twoFactorTokens || twoFactorToken?.token !== code){
						return {
							status: false,
							error: "Invalid Token"
						}
					}

					const hasExpired = new Date(twoFactorToken.expires) < new Date();

					if(hasExpired){
						return {
							status: false,
							error: "Token has expired"
						}
					} 

					await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, twoFactorToken.id));
				}
				else {

					/* TODO: Add additional checking for password match to prevent invalid credentials login. */
					const [twoFactor] = await generateTwoFactorToken(existingUser.email);

					if(!twoFactor){
						return {
							status: true,
							message: "Token not generated"
						}
					}

					await sendTwoFactorTokenEmail(twoFactor.email, twoFactor.token);
					return {
						status: true,
						twoFactor: true,
						message: "Two factor token sent"
					}
				}
			}

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
