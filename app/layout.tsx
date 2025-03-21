import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Nav from "@/components/navigation/nav";

const poppins = Poppins({
	variable: "--font-poppins",
	weight: ["100", "200", "300", "400","500", "600", "700"]
});

export const metadata: Metadata = {
	title: "Sprout Scribble",
	description: "E-commerce website"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`$${poppins.variable} bg-background flex flex-col gap-[16]`}
			>
				<Nav />
				<main className="px-[16]">
					{children}
				</main>
			</body>
		</html>
	);
}
