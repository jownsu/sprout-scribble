"use server";

/* DB */
import { db } from "@/server";
import { users } from "@/server/schema";
import { ResetPasswordSchema } from "@/types/reset-password-schema";

/* PLUGINS */
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

/* ACTIONS */
import { sendResetPasswordEmail } from "@/server/actions/auth/email";
import { generateResetPasswordToken } from "@/server/actions/auth/tokens";

const action = createSafeActionClient();

export const resetPassword = action
	.schema(ResetPasswordSchema)
	.action(async ({ parsedInput: { email } }) => {
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

		if (!existingUser) {
			return {
				status: false,
				message: "User not found"
			};
		}

		const [verification] = await generateResetPasswordToken(email);
		const sendResponse = await sendResetPasswordEmail(
			verification.email,
			verification.token
		);

		return {
			status: sendResponse?.status,
			message: sendResponse?.message
		};
	});
