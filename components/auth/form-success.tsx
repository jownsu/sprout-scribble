import { CheckCircle2 } from "lucide-react";

interface Props {
	message?: string;
}

const FormSuccess = ({ message }: Props) => {
	if (!message) {
		return null;
	}

	return (
		<div className="bg-teal-400 text-secondary-foreground p-[8] rounded-md">
			<CheckCircle2 className="size-[16]" />
			<p>{message}</p>
		</div>
	);
};

export default FormSuccess;
