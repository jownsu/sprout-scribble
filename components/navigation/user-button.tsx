"use client";

import { User } from "next-auth";
import { signOut } from "next-auth/react";

interface Props {
	user?: User;
}

const UserButton = ({ user }: Props) => {
	if (!user) {
		return null;
	}

	return (
		<div className="text-background">
			<h1>{user.name}</h1>
			<button onClick={() => signOut()}>Sign out</button>
		</div>
	);
};

export default UserButton;
