
"use server";

import { db } from "@/server";
import { eq } from "drizzle-orm";
import { emailTokens, passwordResetTokens, twoFactorTokens, users } from "@/server/schema";
import crypto from "crypto"

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.query.emailTokens.findFirst({
            where: eq(emailTokens.email, email)
        });

        return verificationToken
    }
    catch {
        return null;
    }
}

export const getVerificationToken = async (token: string) => {
    try {
        const verificationToken = await db.query.emailTokens.findFirst({
            where: eq(emailTokens.token, token)
        });

        return verificationToken
    }
    catch {
        return null;
    }
}

export const generateEmailVerificationToken = async (email: string) => {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken){
        await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
    }

    const verificationToken = await db.insert(emailTokens).values({
        email,
        token,
        expires
    }).returning();

    return verificationToken;
} 

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationToken(token);

    if(!existingToken){
        return {
            status: false,
            message: "Token not found"
        }
    }
    const hasExpired = new Date(existingToken.expires) < new Date();

    if(hasExpired){
        return {
            status: false,
            message: "Token has expired"
        }
    }

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email)
    });

    if(!existingUser){
        return {
            status: false,
            message: "Email does not exist"
        }
    }

    await db.update(users).set({
        emailVerified: new Date()
    }).where(eq(users.id, existingUser.id))

    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));

    return {
        status: true,
        message: "Email Verified."
    }
}

export const getPasswordResetToken = async (token: string) => {
    try {
        const verificationToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.token, token)
        });

        return verificationToken
    }
    catch {
        return null;
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.email, email)
        });

        return verificationToken
    }
    catch {
        return null;
    }
}

export const generateResetPasswordToken = async (email: string) => {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getPasswordResetTokenByEmail(email);

    if(existingToken){
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id));
    }

    const verificationToken = await db.insert(passwordResetTokens).values({
        email,
        token,
        expires
    }).returning();

    return verificationToken;
}

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db.query.twoFactorTokens.findFirst({
            where: eq(twoFactorTokens.email, email)
        });

        return twoFactorToken
    }
    catch {
        return null;
    }
}

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db.query.twoFactorTokens.findFirst({
            where: eq(twoFactorTokens.token, token)
        });

        return twoFactorToken
    }
    catch {
        return null;
    }
}

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100000, 1000000).toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getTwoFactorTokenByEmail(email);

    if(existingToken){
        await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, existingToken.id));
    }

    const twoFactorToken = await db.insert(twoFactorTokens).values({
        email,
        token,
        expires
    }).returning();

    return twoFactorToken;
}