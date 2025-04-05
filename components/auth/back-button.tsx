"use client";

/* NEXT */
import Link from "next/link";

/* COMPONENTS */
import { Button } from "@/components/ui/button";

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
