"use server";

/* DB */
import { db, dbPool } from "@/server";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { passwordResetTokens, users } from "@/server/schema";

/* PLUGINS */
import { createSafeActionClient } from "next-safe-action";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

/* ACTIONS */
import { getPasswordResetToken } from "@/server/actions/auth/tokens";

const action = createSafeActionClient();

/* Set new password and delete password reset token */
export const newPassword = action
    .schema(NewPasswordSchema)
    .action(async ({ parsedInput: { password, token } }) => {

        /* Return false if there is no token on payload */
        if(!token){
            return {
                status: false,
                message: "Missing Token"
            }
        }

        /* Get and validate password token */
        const existing_token = await getPasswordResetToken(token);

        if(!existing_token){
            return {
                status: false,
                message: "Token not found"
            }
        }

        /* Check if token is expired */
        const has_expired = new Date(existing_token.expires) < new Date();

        if(has_expired){
            return {
                status: false,
                message: "Token has expired"
            }
        }

        /* Check if user exists by email */
        const existing_user = await db.query.users.findFirst({
            where: eq(users.email, existing_token.email)
        });

        if(!existing_user){
            return {
                status: false,
                message: "User not found"
            }
        }

        /* Hashe the new password */
        const hashed_password = await bcrypt.hash(password, 10);

        /* Update the password of the user and delete the password reset token */
        await dbPool.transaction(async (tx) => {
            await tx.update(users)
                .set({password: hashed_password})
                .where(eq(users.id, existing_user.id));
    
            await tx.delete(passwordResetTokens)
                .where(eq(passwordResetTokens.id, existing_token.id));
        });

        return {
            status: true,
            message: "Password updated"
        }
    })