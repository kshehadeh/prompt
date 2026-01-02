import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      bio: true,
      instagram: true,
      twitter: true,
      linkedin: true,
      website: true,
    },
  });

  return NextResponse.json({ user });
}

export async function PUT(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { bio, instagram, twitter, linkedin, website } = body;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      bio: bio ?? null,
      instagram: instagram ?? null,
      twitter: twitter ?? null,
      linkedin: linkedin ?? null,
      website: website ?? null,
    },
    select: {
      id: true,
      name: true,
      bio: true,
      instagram: true,
      twitter: true,
      linkedin: true,
      website: true,
    },
  });

  return NextResponse.json({ user });
}
