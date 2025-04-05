"use server";

/* DB */
import { db } from "@/server";
import { users } from "@/server/schema";
import { RegisterSchema } from "@/types/register-schema";

/* PLUGINS */
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import bcrypt from "bcrypt";

/* ACTIONS */
import { generateEmailVerificationToken } from "@/server/actions/auth/tokens";
import { sendVerificationEmail } from "@/server/actions/auth/email";

const action = createSafeActionClient();

/* Create user and send verification email */
export const emailRegister = action
	.schema(RegisterSchema)
	.action(async ({ parsedInput: { email, name, password } }) => {

		/* Validate the user if existing */
		const existing_user = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

        if(existing_user && existing_user.emailVerified){
            return {
				status: false,
				error: "Email already in use"
			};
        }

        /* Create user if the email is not already used */
        if(!existing_user){
            const hashed_password = await bcrypt.hash(password, 10);

            await db.insert(users).values({
                email,
                name,
                password: hashed_password
            });
        }

        /* Generate verification email and send it to email */
        const [verification] = await generateEmailVerificationToken(email);
        const send_response = await sendVerificationEmail(verification.email, verification.token);

        /* Return error if verification fails */
        if(!send_response?.status){
            return {
                status: false,
                error: send_response?.message
            }
        }

        /* Return success message */
        return {
            status: true,
            data: existing_user?.emailVerified ? "Email confirmation resent" : "Confirmation email sent"
        }
	});
