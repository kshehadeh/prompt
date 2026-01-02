import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { HistoryList } from "@/app/history/history-list";
import { SocialLinks } from "./social-links";

export const dynamic = "force-dynamic";

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: userId },
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
    notFound();
  }

  const isOwnProfile = session?.user?.id === user.id;

  const prompts = await prisma.prompt.findMany({
    where: {
      submissions: {
        some: {
          userId: user.id,
        },
      },
    },
    orderBy: { weekStart: "desc" },
    take: 11,
    include: {
      submissions: {
        where: {
          userId: user.id,
        },
        orderBy: { wordIndex: "asc" },
      },
    },
  });

  const hasMore = prompts.length > 10;
  const initialItems = hasMore ? prompts.slice(0, 10) : prompts;

  const submissionCount = await prisma.submission.count({
    where: { userId: user.id },
  });

  const hasSocialLinks =
    user.instagram || user.twitter || user.linkedin || user.website;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header title="Profile" user={session?.user} />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
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
                  {submissionCount} submission{submissionCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            {isOwnProfile && (
              <Link
                href="/profile/edit"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Edit Profile
              </Link>
            )}
          </div>

          {user.bio && (
            <div
              className="prose prose-sm dark:prose-invert mt-4 max-w-none text-zinc-700 dark:text-zinc-300"
              dangerouslySetInnerHTML={{ __html: user.bio }}
            />
          )}

          {hasSocialLinks && (
            <SocialLinks
              instagram={user.instagram}
              twitter={user.twitter}
              linkedin={user.linkedin}
              website={user.website}
            />
          )}
        </div>

        {initialItems.length > 0 ? (
          <HistoryList
            initialItems={initialItems.map((p) => ({
              ...p,
              weekStart: p.weekStart.toISOString(),
              weekEnd: p.weekEnd.toISOString(),
            }))}
            initialHasMore={hasMore}
            userId={user.id}
          />
        ) : (
          <p className="text-center text-zinc-600 dark:text-zinc-400">
            No submissions yet.
          </p>
        )}
      </main>
    </div>
  );
}
