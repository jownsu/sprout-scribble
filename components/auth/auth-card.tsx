/* NEXT */
import { ReactNode } from "react";

/* COMPONENTS */
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import BackButton from "@/components/auth/back-button";
import Socials from "@/components/auth/socials";

interface Props {
	children: ReactNode;
	card_title: string;
	back_button_href: string;
	back_button_label: string;
	show_socials?: boolean;
}

const AuthCard = ({
	children,
	card_title,
	back_button_href,
	back_button_label,
	show_socials
}: Props) => {
	return (
		<Card className="max-w-[550] mx-auto">
			<CardHeader>
				<CardTitle className="t-[21]">{card_title}</CardTitle>
			</CardHeader>
			<CardContent>{children}</CardContent>
			{show_socials && (
				<CardFooter>
					<Socials />
				</CardFooter>
			)}
			<CardFooter>
				<BackButton href={back_button_href} label={back_button_label} />
			</CardFooter>
		</Card>
	);
};

export default AuthCard;
