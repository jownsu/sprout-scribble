"use server";

import { db } from "@/server";
import { users } from "@/server/schema";
import { LoginSchema } from "@/types/login-schema";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

const action = createSafeActionClient();

export const emailSignIn = action
	.schema(LoginSchema)
	.action(async ({ parsedInput: { email } }) => {
		/* Check if the user is in the database */
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

        /* Check if email was found */
		if (existingUser?.email !== email) {
			return {
				status: false,
				error: "User not found"
			};
		}

		return {
			status: true,
			data: { email }
		};
	});
