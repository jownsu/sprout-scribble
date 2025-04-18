import * as z from "zod";

export const NewPasswordSchema = z.object({
    password: z.string().min(8, {
        message: "Password must be atleast 8 characters long"
    }),
    token: z.string().nullable().optional()
});
