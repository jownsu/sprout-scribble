import { PropsWithChildren } from "react";
import QueryClientProvider from "@/components/providers/query-client-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const Providers = ({ children }: PropsWithChildren) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem
			disableTransitionOnChange
		>
			<QueryClientProvider>{children}</QueryClientProvider>
		</ThemeProvider>
	);
};

export default Providers;
