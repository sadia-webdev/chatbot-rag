import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { business } from "@/db/schema";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const userBusiness = await db
    .select()
    .from(business)
    .where(eq(business.userId, session.user.id))
    .limit(1);

  if (userBusiness.length === 0) {
    redirect("/dashboard/business");
  }

  const currentBusiness = userBusiness[0];

  return (
    <main className='p-8'>
      <h1 className='text-3xl font-semibold'>Welcome, {session.user.name}</h1>

      <p className='mt-2 text-neutral-500'>{currentBusiness.name}</p>
    </main>
  );
}
