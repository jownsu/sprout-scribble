import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Nav from "@/components/navigation/nav";
import { ThemeProvider } from "@/components/providers/theme-provider";

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
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
		<html lang="en" suppressHydrationWarning>
			<body
				className={`$${poppins.variable} bg-background flex flex-col gap-[16]`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<Nav />
					<main className="px-[16]">
						{children}
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
