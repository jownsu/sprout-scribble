"use server";

import { db } from "@/server";
import { eq } from "drizzle-orm";
import { emailTokens } from "../schema";



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
    });

    return verificationToken;
} 

export const sendVerificationEmail = async () => {
    return {};
}