import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { ProfileEditForm } from "./profile-edit-form";

export const dynamic = "force-dynamic";

export default async function ProfileEditPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      instagram: true,
      twitter: true,
      linkedin: true,
      website: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header title="Edit Profile" user={session?.user} />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 flex items-center gap-4">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name || "User"}
              className="h-16 w-16 rounded-full"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
              <span className="text-2xl font-medium text-zinc-600 dark:text-zinc-400">
                {user.name?.charAt(0) || "?"}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              {user.name || "Anonymous"}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Edit your profile information
            </p>
          </div>
        </div>

        <ProfileEditForm
          initialBio={user.bio || ""}
          initialInstagram={user.instagram || ""}
          initialTwitter={user.twitter || ""}
          initialLinkedin={user.linkedin || ""}
          initialWebsite={user.website || ""}
        />
      </main>
    </div>
  );
}
