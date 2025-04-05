"use client";

/* PLUGINS */
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

/* COMONENTS */
import { Button } from "@/components/ui/button";

/* ACTIONS */
import { signIn } from "next-auth/react";

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
