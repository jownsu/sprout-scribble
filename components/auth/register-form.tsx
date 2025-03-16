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
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AuthCard from "./auth-card";

const RegisterForm = () => {
	const form = useForm({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: "",
			password: "",
			name: ""
		}
	});

	const { execute, status } = useAction(emailRegister, {
		onSuccess: (response) => {
			console.log("ON SUCCESS: ", response);
		},
		onError: (response) => {
			console.log("ON ERROR: ", response);
		}
	});

	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		execute(values);
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
						<Button size="sm" variant={"link"} className="w-fit" asChild>
							<Link href={"/auth/reset"}>Forgot your password?</Link>
						</Button>
						<Button
							type="submit"
							className={cn(status === "executing" ? "animate-pulse" : "")}
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
