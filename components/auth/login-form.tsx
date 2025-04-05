"use client";

/* NEXT */
import Link from "next/link";
import { useState } from "react";

/* PLUGINS */
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import * as z from "zod";

/* CONSTANTS */
import { LoginSchema } from "@/types/login-schema";

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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthCard from "@/components/auth/auth-card";
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";

/* HELPERS */
import { cn } from "@/lib/utils";

/* ACTIONS */
import { emailSignIn } from "@/server/actions/auth/email-signin";

const LoginForm = () => {
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [show_two_factor, setShowTwoFactor] = useState(false);

	const form = useForm({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});

	const { execute, status } = useAction(emailSignIn, {
		onSuccess: (response) => {
			if (response.data?.twoFactor) {
				setShowTwoFactor(true);
			}

			if (response.data?.status === true) {
				setSuccess(response.data?.message || "Success");
			}

			if (response.data?.status === false) {
				setError(response.data?.message || "Error");
			}
		}
	});

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		execute(values);
		setError("");
		setSuccess("");
	};

	return (
		<AuthCard
			card_title="Welcome back!"
			back_button_href="/auth/register"
			back_button_label="Create a new account"
			show_socials
		>
			<div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-[16]"
					>
						{show_two_factor && (
							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											We&apos;ve sent your a two factor code to your
											email
										</FormLabel>
										<FormControl>
											<InputOTP
												maxLength={6}
												pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
												disabled={status === "executing"}
												{...field}
											>
												<InputOTPGroup>
													{[...Array(6)].map((_, index) => (
														<InputOTPSlot key={index} index={index} />
													))}
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<FormDescription />
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{!show_two_factor && (
							<>
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
							</>
						)}

						<FormSuccess message={success} />
						<FormError message={error} />

						<Button size="sm" variant={"link"} className="w-fit px-0" asChild>
							<Link href={"/auth/reset"}>Forgot your password?</Link>
						</Button>
						<Button
							type="submit"
							className={cn(status === "executing" ? "animate-pulse" : "")}
						>
							{ show_two_factor ? "Verify" : "Login" }
						</Button>
					</form>
				</Form>
			</div>
		</AuthCard>
	);
};

export default LoginForm;
