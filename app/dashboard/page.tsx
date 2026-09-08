import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { business } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Link from "next/link";

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
      {/* header  */}
      <div className='flex items-center justify-between gap-4 mb-12'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Overview</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Give Kaabe the information it needs to answer your customers.
          </p>
        </div>

        <Button className='bg-accent hover:bg-accent/80'>
          <Upload className='mr-2 size-4' />
          <Link href='/dashboard/knowledge'> Upload document</Link>
        </Button>
      </div>
      <h1 className='text-3xl font-semibold'>Welcome, {session.user.name}</h1>

      <p className='mt-2 text-neutral-500'>{currentBusiness.name}</p>
    </main>
  );
}
