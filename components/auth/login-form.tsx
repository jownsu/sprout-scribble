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
import { LoginSchema } from "@/types/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AuthCard from "./auth-card";
import { emailSignIn } from "@/server/actions/email-signin";
import { useAction } from "next-safe-action/hooks"
import { cn } from "@/lib/utils";

const LoginForm = () => {
	const form = useForm({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});

	const { execute, status } = useAction(emailSignIn, {
		onSuccess: (response) => {
			console.log("ON SUCCESS: ", response);
		},
		onError: (response) => {
			console.log("ON ERROR: ", response);
		}
	});

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		execute(values)
	};

	return (
		<AuthCard
			cardTitle="Welcome back!"
			backButtonHref="/auth/register"
			backButtonLabel="Create a new account"
			showSocials
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
											placeholder="jownsu@gmail.com"
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
						<Button size="sm" variant={"link"} className="w-fit" asChild>
							<Link href={"/auth/reset"}>Forgot your password?</Link>
						</Button>
						<Button 
							type="submit"
							className={cn(status === "executing" ? "animate-pulse" : "")}
						>
							Login
						</Button>
					</form>
				</Form>
			</div>
		</AuthCard>
	);
};

export default LoginForm;
