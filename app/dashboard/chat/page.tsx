import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const ChatPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const conversationId = crypto.randomUUID();

 

  redirect(`/dashboard/chat/${conversationId}`);
};

export default ChatPage;
