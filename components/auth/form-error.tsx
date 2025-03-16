import { AlertCircle } from "lucide-react";

interface Props {
	message?: string;
}

const FormError = ({ message }: Props) => {
	if (!message) {
		return null;
	}

	return (
		<div className="bg-destructive text-secondary-foreground p-[8] rounded-md">
			<AlertCircle className="size-[16]" />
			<p>{message}</p>
		</div>
	);
};

export default FormError;
