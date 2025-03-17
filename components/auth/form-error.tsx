import { AlertCircle } from "lucide-react";

interface Props {
	message?: string;
}

const FormError = ({ message }: Props) => {
	if (!message) {
		return null;
	}

	return (
		<div className="bg-red-200 text-secondary-foreground p-[12] rounded-md flex items-center gap-[8] t-[12] font-normal">
			<AlertCircle className="size-[14] shrink-0" />
			<p>{message}</p>
		</div>
	);
};

export default FormError;
