import { auth } from "@/server/auth";
import Logo from "./logo";
import UserButton from "./user-button";

const Nav = async () => {
	const session = await auth();

	return (
		<header className="bg-slate-500 py-4">
			<nav>
				<ul className="flex justify-between">
					<li>
						<Logo />
					</li>
					<li>
						<UserButton user={session?.user} />
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Nav;
