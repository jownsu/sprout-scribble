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
import { NewPasswordSchema } from "@/types/new-password-schema";
import { newPassword } from "@/server/actions/new-password";
import { useSearchParams } from "next/navigation";

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
			cardTitle="Enter a new password"
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
