import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { ReactNode } from "react";
import BackButton from "./back-button";
import Socials from "./socials";

interface Props {
	children: ReactNode;
	cardTitle: string;
	backButtonHref: string;
	backButtonLabel: string;
	showSocials?: boolean;
}

const AuthCard = ({
	children,
	cardTitle,
	backButtonHref,
	backButtonLabel,
	showSocials
}: Props) => {
	return (
		<Card className="max-w-[550] mx-auto">
			<CardHeader>
				<CardTitle className="t-[21]">{cardTitle}</CardTitle>
			</CardHeader>
			<CardContent>{children}</CardContent>
			{showSocials && (
				<CardFooter>
					<Socials />
				</CardFooter>
			)}
			<CardFooter>
				<BackButton href={backButtonHref} label={backButtonLabel} />
			</CardFooter>
		</Card>
	);
};

export default AuthCard;
