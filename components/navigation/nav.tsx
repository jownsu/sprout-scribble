import { auth } from "@/server/auth";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "./logo";
import UserButton from "./user-button";

const Nav = async () => {
	const session = await auth();

	return (
		<header className="bg-foreground p-[16]">
			<nav className="container">
				<ul className="flex justify-between items-center">
					<li>
						<Logo />
					</li>
					<li>
						{session ? (
							<UserButton user={session?.user} />
						) : (
							<Button asChild>
								<Link href={"/auth/login"} className="text-background">
									<LogIn /> <span>Login</span>
								</Link>
							</Button>
						)}
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Nav;
