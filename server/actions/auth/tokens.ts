"use server";

/* DB */
import { db } from "@/server";
import {
	emailTokens,
	passwordResetTokens,
	twoFactorTokens,
	users
} from "@/server/schema";

/* PLUGIN */
import { eq } from "drizzle-orm";
import crypto from "crypto";

/* Get emailTokens by email */
export const getVerificationTokenByEmail = async (email: string) => {
	try {
		const email_token = await db.query.emailTokens.findFirst({
			where: eq(emailTokens.email, email)
		});

		return email_token;
	} catch {
		return null;
	}
};

/* Get emailTokens by token */
export const getVerificationToken = async (token: string) => {
	try {
		const email_token = await db.query.emailTokens.findFirst({
			where: eq(emailTokens.token, token)
		});

		return email_token;
	} catch {
		return null;
	}
};

/* Generate emailTokens */
export const generateEmailVerificationToken = async (email: string) => {
	const token = crypto.randomUUID();
	const expires = new Date(new Date().getTime() + 3600 * 1000);
	const existing_email_token = await getVerificationTokenByEmail(email);

	if (existing_email_token) {
		await db.delete(emailTokens).where(eq(emailTokens.id, existing_email_token.id));
	}

	const new_email_token = await db
		.insert(emailTokens)
		.values({
			email,
			token,
			expires
		})
		.returning();

	return new_email_token;
};

/* Verify user and delete the given token */
export const verifyUser = async (token: string) => {
	/* Validate the token if existing */
	const existing_verification_token = await getVerificationToken(token);

	if (!existing_verification_token) {
		return {
			status: false,
			message: "Token not found"
		};
	}

	/* Validate if token was expired */
	const has_expired = new Date(existing_verification_token.expires) < new Date();

	if (has_expired) {
		return {
			status: false,
			message: "Token has expired"
		};
	}

	/* Validate user if existing */
	const existing_user = await db.query.users.findFirst({
		where: eq(users.email, existing_verification_token.email)
	});

	if (!existing_user) {
		return {
			status: false,
			message: "Email does not exist"
		};
	}

	/* Update the user to email verified */
	await db
		.update(users)
		.set({
			emailVerified: new Date()
		})
		.where(eq(users.id, existing_user.id));

	/* Delete the token */
	await db
		.delete(emailTokens)
		.where(eq(emailTokens.id, existing_verification_token.id));

	return {
		status: true,
		message: "Email Verified."
	};
};

/* Get passwordResetTokens by token */
export const getPasswordResetToken = async (token: string) => {
	try {
		const password_reset_token = await db.query.passwordResetTokens.findFirst({
			where: eq(passwordResetTokens.token, token)
		});

		return password_reset_token;
	} catch {
		return null;
	}
};

/* Get passwordResetTokens by email */
export const getPasswordResetTokenByEmail = async (email: string) => {
	try {
		const password_reset_token = await db.query.passwordResetTokens.findFirst({
			where: eq(passwordResetTokens.email, email)
		});

		return password_reset_token;
	} catch {
		return null;
	}
};

/* Generate passwordResetTokens */
export const generateResetPasswordToken = async (email: string) => {
	/* Setup the password reset token */
	const token = crypto.randomUUID();
	const expires = new Date(new Date().getTime() + 3600 * 1000);

	/* Validate password reset token */
	const existing_password_reset_token = await getPasswordResetTokenByEmail(email);

	/* Delete existing token if there is one */
	if (existing_password_reset_token) {
		await db
			.delete(passwordResetTokens)
			.where(eq(passwordResetTokens.id, existing_password_reset_token.id));
	}

	/* Create password reset token */
	const new_password_reset_token = await db
		.insert(passwordResetTokens)
		.values({
			email,
			token,
			expires
		})
		.returning();

	return new_password_reset_token;
};

/* Get twoFactorTokens by email */
export const getTwoFactorTokenByEmail = async (email: string) => {
	try {
		const two_factor_token = await db.query.twoFactorTokens.findFirst({
			where: eq(twoFactorTokens.email, email)
		});

		return two_factor_token;
	} catch {
		return null;
	}
};

/* Get twoFactorTokens by token */
export const getTwoFactorTokenByToken = async (token: string) => {
	try {
		const two_factor_token = await db.query.twoFactorTokens.findFirst({
			where: eq(twoFactorTokens.token, token)
		});

		return two_factor_token;
	} catch {
		return null;
	}
};

/* Generate twoFactorTokens */
export const generateTwoFactorToken = async (email: string) => {
	/* Setup the two factor token */
	const token = crypto.randomInt(100000, 1000000).toString();
	const expires = new Date(new Date().getTime() + 3600 * 1000);

	/* Validate two factor token */
	const existing_two_factor_token = await getTwoFactorTokenByEmail(email);

	/* Delete existing token if there is one */
	if (existing_two_factor_token) {
		await db
			.delete(twoFactorTokens)
			.where(eq(twoFactorTokens.id, existing_two_factor_token.id));
	}

	/* Create two factor token */
	const new_two_factor_token = await db
		.insert(twoFactorTokens)
		.values({
			email,
			token,
			expires
		})
		.returning();

	return new_two_factor_token;
};
