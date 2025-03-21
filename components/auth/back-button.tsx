"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
	href: string;
	label: string;
}

const BackButton = ({ href, label }: Props) => {
	return (
		<Button className="w-full" variant={"link"} asChild>
			<Link href={href}>{label}</Link>
		</Button>
	);
};

export default BackButton;
