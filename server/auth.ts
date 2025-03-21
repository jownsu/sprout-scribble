import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/types/login-schema";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: DrizzleAdapter(db),
    secret: process.env.AUTH_SECRET!,
    session: { strategy: "jwt" },
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			allowDangerousEmailAccountLinking: true
		}),
		Github({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			allowDangerousEmailAccountLinking: true
		}),
		Credentials({
			async authorize(credentials) {
				const validateFields = LoginSchema.safeParse(credentials);

				if(validateFields.success){
					const { email, password } = validateFields.data;

					const user = await db.query.users.findFirst({
						where: eq(users.email, email)
					});
					
					const passwordMatch = await bcrypt.compare(password, user?.password || "");

					if(user && passwordMatch){
						return user;
					}
				}

				return null;
			},
		})
	]
});
