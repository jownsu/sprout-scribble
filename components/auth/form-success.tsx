import { CheckCircle2 } from "lucide-react";

interface Props {
	message?: string;
}

const FormSuccess = ({ message }: Props) => {
	if (!message) {
		return null;
	}

	return (
		<div className="bg-emerald-200 text-secondary-foreground p-[12] rounded-md flex items-center gap-[8] t-[12] font-normal">
			<CheckCircle2 className="size-[14]" />
			<p>{message}</p>
		</div>
	);
};

export default FormSuccess;
