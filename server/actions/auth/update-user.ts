"use server";

/* NEXT */
import { revalidatePath } from "next/cache";

/* DB */
import { db } from "@/server";
import { auth } from "@/server/auth";
import { users } from "@/server/schema";
import { SettingsSchema } from "@/types/settings-schema";

/* PLUGINS */
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

const action = createSafeActionClient();

/* Update the password, two factor or avatar of the user */
export const updateUser = action
	.schema(SettingsSchema)
	.action(async ({ parsedInput: values }) => {
		
		/* Validate if the user is logged in */
		const user = await auth();

		if (!user) {
			return { error: "User not found" };
		}

		/* Validate the user if existing */
		const db_user = await db.query.users.findFirst({
			where: eq(users.id, user.user.id)
		});

		if (!db_user) {
			return { error: "User not found" };
		}

		/* Set chosen fields to undefined if the user is registered by OAuth */
		if (user.user.isOAuth) {
			values.email = undefined;
			values.password = undefined;
			values.newPassword = undefined;
			values.isTwoFactorEnabled = undefined;
		}

		/* Setup the password payload if the user is not registered by OAuth */
		if (values.password && values.newPassword && db_user.password) {

			/* Validate if given password is match to the record */
			const password_match = await bcrypt.compare(values.password, db_user.password);
			
			if (!password_match) {
				return { error: "Password does not match" };
			}

			/* Validate if given password is same as old password */
			const same_password = await bcrypt.compare(
				values.newPassword,
				db_user.password
			);

			if (same_password) {
				return { error: "New password is the same as the old password" };
			}
			
			/* Hash the given password and set the password payload */
			const hashed_password = await bcrypt.hash(values.newPassword, 10);
			
			values.password = hashed_password;
			values.newPassword = undefined;
		}

		/* Update the user */
		await db
			.update(users)
			.set({
				twoFactorEnabled: values.isTwoFactorEnabled,
				name: values.name,
				email: values.email,
				password: values.password,
				image: values.image
			})
			.where(eq(users.id, db_user.id));

		revalidatePath("/dashboard/settings");

		return { success: "Settings updated" };
	});
