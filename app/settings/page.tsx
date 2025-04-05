/* NEXT */
import { redirect } from "next/navigation";

/* COMPONENTS */
import SettingsCard from "@/components/settings/settings-card";

/* HELPERS */
import { auth } from "@/server/auth";

const SettingsPage = async () => {
    const session = await auth();

    if (!session) {
        return redirect("/")
    };

    return <SettingsCard session={session} />
};

export default SettingsPage;
