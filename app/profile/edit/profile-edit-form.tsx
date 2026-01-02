"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/rich-text-editor";

interface ProfileEditFormProps {
  initialBio: string;
  initialInstagram: string;
  initialTwitter: string;
  initialLinkedin: string;
  initialWebsite: string;
}

export function ProfileEditForm({
  initialBio,
  initialInstagram,
  initialTwitter,
  initialLinkedin,
  initialWebsite,
}: ProfileEditFormProps) {
  const router = useRouter();
  const [bio, setBio] = useState(initialBio);
  const [instagram, setInstagram] = useState(initialInstagram);
  const [twitter, setTwitter] = useState(initialTwitter);
  const [linkedin, setLinkedin] = useState(initialLinkedin);
  const [website, setWebsite] = useState(initialWebsite);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: bio || null,
          instagram: instagram || null,
          twitter: twitter || null,
          linkedin: linkedin || null,
          website: website || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      router.push(`/profile/${(await response.json()).user.id}`);
      router.refresh();
    } catch {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-white">
          Bio
        </label>
        <RichTextEditor
          value={bio}
          onChange={setBio}
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="instagram"
            className="mb-2 block text-sm font-medium text-zinc-900 dark:text-white"
          >
            Instagram
          </label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              @
            </span>
            <input
              type="text"
              id="instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="username"
              className="block w-full rounded-r-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="twitter"
            className="mb-2 block text-sm font-medium text-zinc-900 dark:text-white"
          >
            X (Twitter)
          </label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              @
            </span>
            <input
              type="text"
              id="twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="username"
              className="block w-full rounded-r-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="linkedin"
            className="mb-2 block text-sm font-medium text-zinc-900 dark:text-white"
          >
            LinkedIn
          </label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              in/
            </span>
            <input
              type="text"
              id="linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="username"
              className="block w-full rounded-r-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="website"
            className="mb-2 block text-sm font-medium text-zinc-900 dark:text-white"
          >
            Website
          </label>
          <input
            type="url"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
