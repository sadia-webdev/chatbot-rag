import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { conversation, business } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  // 1. Get the logged-in user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2. Find the user's business
  const userBusiness = await db
    .select()
    .from(business)
    .where(eq(business.userId, session.user.id))
    .limit(1);

  if (!userBusiness[0]) {
    return NextResponse.json(
      { error: "Business not found" },
      { status: 404 }
    );
  }

  // 3. Create the conversation
  const newConversation = {
    id: crypto.randomUUID(),
    title: "New conversation",
    userId: session.user.id,
  };

  await db.insert(conversation).values(newConversation);

  // 4. Return the conversation
  return NextResponse.json({
    conversation: newConversation,
  });
}