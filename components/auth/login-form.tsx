import AuthCard from "./auth-card";

const LoginForm = () => {
	return (
		<AuthCard
			cardTitle="Welcome back!"
			backButtonHref="/auth/register"
			backButtonLabel="Create a new account"
			showSocials
		>
			<div></div>
		</AuthCard>
	);
};

export default LoginForm;
