import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAvatarUrl } from "@/lib/aliases";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const profile = await db.publicProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      alias: true,
      avatarSeed: true,
      createdAt: true,
    },
  });

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">
          Welcome, <span className="text-gray-400">{profile.alias}</span>
        </h1>
        <p className="text-gray-400">
          You're part of a community of students supporting each other through the placement journey.
        </p>
      </div>

      {/* Profile Card */}
      <Card className="p-8 border border-gray-800 bg-gray-950">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src={getAvatarUrl(profile.avatarSeed)}
              alt={profile.alias}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold">{profile.alias}</h2>
              <p className="text-gray-500">
                Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Link href="/settings">
            <Button className="bg-white text-black hover:bg-gray-100">
              Edit Profile
            </Button>
          </Link>
        </div>
      </Card>

      {/* Coming Soon Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          {
            title: "Anonymous Feed",
            description: "Share your placement journey and read others' stories",
            phase: "Phase 2",
          },
          {
            title: "Peer Groups",
            description: "Join communities of students with similar goals",
            phase: "Phase 3",
          },
          {
            title: "Voice Rooms",
            description: "Connect with peers in real-time anonymous conversations",
            phase: "Phase 4",
          },
          {
            title: "AI Companion",
            description: "Get personalized support and placement guidance",
            phase: "Phase 5",
          },
        ].map((item) => (
          <Card key={item.title} className="p-6 border border-gray-800 bg-gray-950 opacity-50">
            <div className="text-xs text-gray-500 mb-2">{item.phase}</div>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}