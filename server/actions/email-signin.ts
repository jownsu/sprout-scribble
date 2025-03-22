"use server";

import { db } from "@/server";
import { users } from "@/server/schema";
import { LoginSchema } from "@/types/login-schema";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { signIn } from "../auth";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";
import { AuthError } from "next-auth";

const action = createSafeActionClient();

export const emailSignIn = action
	.schema(LoginSchema)
	.action(async ({ parsedInput: { email, password } }) => {



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
