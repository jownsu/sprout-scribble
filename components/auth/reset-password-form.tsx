"use client";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AuthCard from "./auth-card";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { useState } from "react";
import { ResetPasswordSchema } from "@/types/reset-password-schema";
import { resetPassword } from "@/server/actions/reset-password";

const ResetPasswordForm = () => {
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const form = useForm({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			email: ""
		}
	});

	const { execute, status } = useAction(resetPassword, {
		onSuccess: (response) => {
			if (response.data?.status === true) {
				setSuccess(response.data?.message || "Success");
			}

			if (response.data?.status === false) {
				setError(response.data?.message || "Error");
			}
		}
	});

	const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
		execute(values);
		setError("");
		setSuccess("");
	};

	return (
		<AuthCard
			cardTitle="Forgot your password?"
			backButtonHref="/auth/login"
			backButtonLabel="Back to login"
		>
			<div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-[16]"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="johndoe@gmail.com"
											type="email"
											autoComplete="email"
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

export default ResetPasswordForm;
