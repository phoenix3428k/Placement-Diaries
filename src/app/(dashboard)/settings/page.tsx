import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProfile } from "@/actions/users";
import { Card } from "@/components/ui/card";
import SettingsForm from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const profile = await getUserProfile();

  if (!session?.user?.id || !profile) {
    return null;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Card className="p-8 border border-gray-800 bg-gray-950 space-y-6">
        <SettingsForm profile={profile} />
      </Card>
    </div>
  );
}