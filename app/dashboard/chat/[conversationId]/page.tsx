import { and, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Chat from "@/components/chat";
import { db } from "@/db/drizzle";
import { conversation, message } from "@/db/schema";
import { auth } from "@/lib/auth";

type PageProps = {
  params: Promise<{
    conversationId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { conversationId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const conversationResult = await db
    .select()
    .from(conversation)
    .where(
      and(
        eq(conversation.id, conversationId),
        eq(conversation.userId, session.user.id),
      ),
    )
    .limit(1);

  let initialMessages = [];

  if (conversationResult.length > 0) {
    const dbMessages = await db
      .select()
      .from(message)
      .where(eq(message.conversationId, conversationId))
      .orderBy(asc(message.createdAt));

    initialMessages = dbMessages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      parts: [
        {
          type: "text" as const,
          text: msg.content,
        },
      ],
    }));
  }

  return (
    <Chat conversationId={conversationId} initialMessages={initialMessages} />
  );
}
