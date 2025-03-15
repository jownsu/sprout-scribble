import { auth } from "@/server/auth";
import Logo from "./logo";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

const Nav = async () => {
	const session = await auth();

	return (
		<header className="bg-grey-900 py-4 px-3">
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
								<Link href={"/auth/login"} className="text-beige-100">
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
