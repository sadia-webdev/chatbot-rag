// app/dashboard/layout.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { conversation } from "@/db/schema";
import { db } from "@/db/drizzle";

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



  return (
    <SidebarProvider>
      <AppSidebar user={session.user}/>

      <main className='flex flex-1 flex-col text-gray-800 bg-white'>
        <SidebarToggle />

        <div className='flex-1 p-4'>{children}</div>
      </main>
    </SidebarProvider>
  );
}
