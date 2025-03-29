import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import SettingsCard from "./_components/settings-card";

const SettingsPage = async () => {
	const session = await auth();

	if (!session) {
        return redirect("/")
    };

    return <SettingsCard session={session} />
};

export default SettingsPage;
