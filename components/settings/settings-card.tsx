"use client";

/* NEXT */
import { useState } from "react";

/* PLUGINS */
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";

/* COMPONENTS */
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

/* CONSTANTS */
import { SettingsSchema } from "@/types/settings-schema";

/* ACTIONS */
import { updateUser } from "@/server/actions/auth/update-user";

/* HELPERS */
import { UploadButton } from "@/lib/uploadthing";

type SettingsForm = {
	session: Session;
};

export default function SettingsCard(session: SettingsForm) {
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();
	const [avatar_uploading, setAvatarUploading] = useState(false);

	/* TODO: Make updating of password optional */
	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			password: "",
			newPassword: "",
			name: session.session.user?.name || "",
			email: session.session.user?.email || "",
			image: session.session.user?.image || "",
			isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || false
		}
	});

	const { execute, status } = useAction(updateUser, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				setSuccess(data?.data.success);
			}
			if (data?.data?.error) {
				setError(data?.data?.error);
			}
		},
		onError: () => {
			setError("Something went wrong");
		}
	});

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		execute(values);
		setError("");
		setSuccess("");
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Settings</CardTitle>
				<CardDescription>Update your account settings</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="John Doe"
											disabled={status === "executing"}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This is your public display name.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Avatar</FormLabel>
									<div className="flex items-center gap-4">
										<Avatar>
											<AvatarImage src={form.getValues("image")} />
											<AvatarFallback className="bg-primary text-white">
												{session.session.user?.name
													?.charAt(0)
													.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										{/* TODO: Upload only on submit not on Upload. */}
										<UploadButton
											className="scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"
											endpoint="avatarUploader"
											onUploadBegin={() => {
												setAvatarUploading(true);
											}}
											onUploadError={(error) => {
												form.setError("image", {
													type: "validate",
													message: error.message
												});
												setAvatarUploading(false);
												return;
											}}
											onClientUploadComplete={(res) => {
												console.log(res);
												form.setValue("image", res[0].ufsUrl);
												setAvatarUploading(false);
												return;
											}}
											content={{
												button({ ready }) {
													if (ready) {
														return <div>Change Avatar</div>;
													}

													return <div>Uploading...</div>;
												}
											}}
										/>
									</div>
									<FormControl>
										<Input
											placeholder="User Image"
											type="hidden"
											disabled={status === "executing"}
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											placeholder="********"
											disabled={
												status === "executing" ||
												session?.session.user.isOAuth
											}
											type="password"
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input
											placeholder="*******"
											disabled={
												status === "executing" ||
												session?.session.user.isOAuth
											}
											type="password"
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isTwoFactorEnabled"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Two Factor Authentication</FormLabel>
									<FormDescription>
										Enable two factor authentication for your account
									</FormDescription>
									<FormControl>
										<Switch
											disabled={
												status === "executing" ||
												session.session.user.isOAuth === true
											}
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormError message={error} />
						<FormSuccess message={success} />
						<Button
							type="submit"
							disabled={status === "executing" || avatar_uploading}
						>
							Update your settings
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
