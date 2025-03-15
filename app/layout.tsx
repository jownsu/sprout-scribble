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
				className={`$${poppins.variable} container bg-beige-100`}
			>
				<Nav />
				{children}
			</body>
		</html>
	);
}
