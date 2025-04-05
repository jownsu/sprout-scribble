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

export const emailRegister = action
	.schema(RegisterSchema)
	.action(async ({ parsedInput: { email, name, password } }) => {

        /* Get the user by email */
		const user = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

        /* Stop if the email is taken and already verified */
        if(user && user.emailVerified){
            return {
				status: false,
				error: "Email already in use"
			};
        }

        /* Create user if the email is not already used */
        if(!user){
            const hashedPassword = await bcrypt.hash(password, 10);

            await db.insert(users).values({
                email,
                name,
                password: hashedPassword
            });
        }

        const [verification] = await generateEmailVerificationToken(email);
        const sendResponse = await sendVerificationEmail(verification.email, verification.token);

        if(!sendResponse?.status){
            return {
                status: false,
                error: sendResponse?.message
            }
        }

        return {
            status: true,
            data: user?.emailVerified ? "Email confirmation resent" : "Confirmation email sent"
        }
	});
