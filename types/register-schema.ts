import * as z from "zod";

export const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, {
		message: "Password must be atleast 8 characters long"
	}),
	name: z.string().min(1, {
		message: "Please enter your name"
	})
});
