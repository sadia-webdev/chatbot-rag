// app/dashboard/layout.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/db/drizzle";
import { conversation } from "@/db/schema";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }


  const conversations = await db
    .select()
    .from(conversation)
    .where(eq(conversation.userId, session.user.id))
    .orderBy(desc(conversation.updatedAt));


  return (
    <SidebarProvider>
      <AppSidebar user={session.user} conversations={conversations} />

      <main className='flex flex-1 flex-col text-gray-800 bg-white'>
        <SidebarToggle />

        <div className='flex-1 p-4'>{children}</div>
      </main>
    </SidebarProvider>
  );
}
