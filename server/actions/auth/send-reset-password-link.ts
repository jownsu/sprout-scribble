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

/* Send reset password link to the given email */
export const sendResetPasswordLink = action
	.schema(ResetPasswordSchema)
	.action(async ({ parsedInput: { email } }) => {

		/* Validate the user if existing */
		const existing_user = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

		if (!existing_user) {
			return {
				status: false,
				message: "User not found"
			};
		}

		/* Generate password reset token and send to given email */
		const [verification] = await generateResetPasswordToken(email);
		const send_response = await sendResetPasswordEmail(
			verification.email,
			verification.token
		);

		return {
			status: send_response?.status,
			message: send_response?.message
		};
	});
