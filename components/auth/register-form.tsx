"use client";

/* NEXT */
import Link from "next/link";
import { useState } from "react";

/* PLUGINS */
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
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
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";

/* ACTIONS */
import { emailRegister } from "@/server/actions/email-register";

/* CONSTANTS */
import { RegisterSchema } from "@/types/register-schema";

/* HELPERS */
import { cn } from "@/lib/utils";

const RegisterForm = () => {
	const form = useForm({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: "",
			password: "",
			name: ""
		}
	});

	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

	const { execute, status } = useAction(emailRegister, {
		onSuccess: (response) => {
			if(response.data?.status){
				setSuccess(response?.data.data || "");
				setError("");
			}
			else {
				setError(response?.data?.error || "");
				setSuccess("");
			}
		},
	});

	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		execute(values);
		setSuccess("");
		setError("");
	};

	return (
		<AuthCard
			card_title="Create an account"
			back_button_href="/auth/login"
			back_button_label="Already have an account?"
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
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="johndoe@gmail.com"
											type="email"
											autoComplete="email"
										/>
									</FormControl>
									<FormDescription />
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
											{...field}
											placeholder="********"
											type="password"
											autoComplete="current-password"
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="John Doe"
											type="text"
											autoComplete="name"
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormSuccess message={success} />
						<FormError message={error} />
						<Button size="sm" variant={"link"} className="w-fit" asChild>
							<Link href={"/auth/reset"}>Forgot your password?</Link>
						</Button>
						<Button
							type="submit"
							className={cn(status === "executing" ? "animate-pulse" : "")}
							disabled={status === "executing"}
						>
							Register
						</Button>
					</form>
				</Form>
			</div>
		</AuthCard>
	);
};

export default RegisterForm;
