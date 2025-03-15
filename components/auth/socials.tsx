"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Socials = () => {
	return (
		<div className="flex flex-col items-center w-full gap-[16]">
			<Button
				variant="outline"
				className="flex gap-[16] w-full"
				onClick={() =>
					signIn("google", {
						redirect: false,
						redirectTo: "/"
					})
				}
			>
				Sign in with Google
				<FcGoogle className="size-[16]" />
			</Button>
			<Button
				variant="outline"
				className="flex gap-[16] w-full"
				onClick={() =>
					signIn("github", {
						redirect: false,
						redirectTo: "/"
					})
				}
			>
				Sign in with Github
				<FaGithub className="size-[16]" />
			</Button>
		</div>
	);
};

export default Socials;
