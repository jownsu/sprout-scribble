"use client";

/* NEXT */
import { useState } from "react";
import { useSearchParams } from "next/navigation";

/* PLUGINS */
import { useAction } from "next-safe-action/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

/* COMPONENTS */
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthCard from "@/components/auth/auth-card";
import FormSuccess from "@/components/auth/form-success";
import FormError from "@/components/auth/form-error";

/* CONSTANTS */
import { NewPasswordSchema } from "@/types/new-password-schema";

/* ACTION */
import { newPassword } from "@/server/actions/auth/new-password";

/* HELPERS */
import { cn } from "@/lib/utils";

const NewPasswordForm = () => {
	const token = useSearchParams().get("token");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const form = useForm({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			token,
			password: ""
		}
	});

	const { execute, status } = useAction(newPassword, {
		onSuccess: (response) => {
			if (response.data?.status === true) {
				setSuccess(response.data?.message || "Success");
			}

			if (response.data?.status === false) {
				setError(response.data?.message || "Error");
			}
		}
	});

	const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
		execute(values);
		setError("");
		setSuccess("");
	};

	return (
		<AuthCard
			card_title="Enter a new password"
			back_button_href="/auth/login"
			back_button_label="Back to login"
		>
			<div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-[16]"
					>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="********"
											type="password"
											autoComplete="current-password"
											disabled={status === "executing"}
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormSuccess message={success} />
						<FormError message={error} />
						<Button
							type="submit"
							className={cn(status === "executing" ? "animate-pulse" : "")}
						>
							Reset Password
						</Button>
					</form>
				</Form>
			</div>
		</AuthCard>
	);
};

export default NewPasswordForm;
