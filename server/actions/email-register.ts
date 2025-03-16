"use server";

import { db } from "@/server";
import { users } from "@/server/schema";
import { RegisterSchema } from "@/types/register-schema";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import bcrypt from "bcrypt";
import { generateEmailVerificationToken, sendVerificationEmail } from "./tokens";

const action = createSafeActionClient();

export const emailRegister = action
	.schema(RegisterSchema)
	.action(async ({ parsedInput: { email, name, password } }) => {

        /* Get the user by email */
		const user = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

		/* Check if the user is in the database */
        if(user){
            /* Will generate token if the fetched user is not verified */
            if(!user.emailVerified){
                await generateEmailVerificationToken(email);
                await sendVerificationEmail();

                return {
                    status: true,
                    data: "Email confirmation resent"
                }
            }

			return {
				status: false,
				error: "Email already in use"
			};
        }

        /* Register the user if it is not exists on database */
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({
            email,
            name,
            password: hashedPassword
        });

        await generateEmailVerificationToken(email);
        await sendVerificationEmail();

        return {
            status: true,
            data: "Confirmation email sent"
        };
	});
