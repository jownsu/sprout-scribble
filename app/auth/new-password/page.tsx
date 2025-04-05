/* NEXT */
import { Suspense } from "react";

/* COMPONENTS */
import NewPasswordForm from "@/components/auth/new-password-form";

const PasswordResetPage = () => {
	return (
		<Suspense>
			<NewPasswordForm />
		</Suspense>
	);
};

export default PasswordResetPage;
