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
import { cn } from "@/lib/utils";
import { emailRegister } from "@/server/actions/email-register";
import { RegisterSchema } from "@/types/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AuthCard from "./auth-card";
import FormError from "./form-error";
import FormSuccess from "./form-success";

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
			cardTitle="Create an account"
			backButtonHref="/auth/login"
			backButtonLabel="Already have an account?"
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
