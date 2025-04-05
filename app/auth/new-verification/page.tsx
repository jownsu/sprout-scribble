/* NEXT */
import { Suspense } from "react";

/* COMPONENTS */
import EmailVerificationForm from "@/components/auth/email-verification-form";

const NewVerificationPage = () => {
	return (
		<Suspense>
			<EmailVerificationForm />
		</Suspense>
	);
};

export default NewVerificationPage;
