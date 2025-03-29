"use server";

import { ResetPasswordSchema } from "@/types/reset-password-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateResetPasswordToken } from "./tokens";
import { sendResetPasswordEmail } from "./email";

const action = createSafeActionClient();

export const resetPassword = action
    .schema(ResetPasswordSchema)
    .action(async ({ parsedInput: { email } }) => {

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if(!existingUser){
            return {
                status: false,
                message: "User not found"
            }
        }

        const [verification] = await generateResetPasswordToken(email);
        const sendResponse = await sendResetPasswordEmail(verification.email, verification.token);

        return {
            status: sendResponse?.status,
            message: sendResponse?.message
        };
    })