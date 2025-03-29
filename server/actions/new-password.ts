"use server";

import { NewPasswordSchema } from "@/types/new-password-schema";
import { createSafeActionClient } from "next-safe-action";
import { getPasswordResetToken } from "./tokens";
import { db, dbPool } from "..";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "../schema";
import bcrypt from "bcrypt";

const action = createSafeActionClient();

export const newPassword = action
    .schema(NewPasswordSchema)
    .action(async ({ parsedInput: { password, token } }) => {

        if(!token){
            return {
                status: false,
                message: "Missing Token"
            }
        }

        const existingToken = await getPasswordResetToken(token);

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
                message: "User not found"
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await dbPool.transaction(async (tx) => {
            await tx.update(users)
                .set({password: hashedPassword})
                .where(eq(users.id, existingUser.id));
    
            await tx.delete(passwordResetTokens)
                .where(eq(passwordResetTokens.id, existingToken.id));
        });

        return {
            status: true,
            message: "Password updated"
        }
    })