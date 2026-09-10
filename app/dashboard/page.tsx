import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import {
  ArrowUpRight,
  Bot,
  FileText,
  MessageSquare,
  MessagesSquare,
  Plus
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { MessageTrendChart } from "@/components/message-trend-chart";
import { db } from "@/db/drizzle";
import { business, conversation, document, message } from "@/db/schema";
import { auth } from "@/lib/auth";

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

  const conversationCount = await db
    .select({ count: count() })
    .from(conversation)
    .where(eq(conversation.userId, session.user.id));

  const messageCount = await db
    .select({ count: count() })
    .from(message)
    .where(eq(message.userId, session.user.id));

  const documentCount = await db
    .select({ count: count() })
    .from(document)
    .where(eq(document.businessId, currentBusiness.id));

  const recentDocuments = await db
    .select()
    .from(document)
    .where(eq(document.businessId, currentBusiness.id))
    .orderBy(desc(document.createdAt))
    .limit(5);

  const recentConversations = await db
    .select()
    .from(conversation)
    .where(eq(conversation.userId, session.user.id))
    .orderBy(desc(conversation.updatedAt))
    .limit(5);



    const DAYS = 14; // swap to 7 or 30 whenever you want

    const since = new Date();
    since.setDate(since.getDate() - (DAYS - 1));
    since.setHours(0, 0, 0, 0);

    const rawTrend = await db
      .select({
        day: sql<string>`date_trunc('day', ${message.createdAt})::date`.as(
          "day",
        ),
        count: count(),
      })
      .from(message)
      .where(
        and(eq(message.userId, session.user.id), gte(message.createdAt, since)),
      )
      .groupBy(sql`date_trunc('day', ${message.createdAt})`)
      .orderBy(sql`date_trunc('day', ${message.createdAt})`);

    const trendMap = new Map(
      rawTrend.map((row) => [new Date(row.day).toDateString(), row.count]),
    );

    const messageTrend = Array.from({ length: DAYS }, (_, i) => {
      const date = new Date(since);
      date.setDate(date.getDate() + i);
      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        count: trendMap.get(date.toDateString()) ?? 0,
      };
    });

  return (
    <main className='min-h-screen space-y-8 bg-neutral-50/50 p-6 md:p-10'>
      {/* Top Banner / Hero Header */}
      <div className='flex flex-col gap-4 rounded-2xl  bg-white p-6  sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse' />
            <span className='text-xs font-semibold uppercase tracking-wider text-neutral-500'>
              RAG Engine Active
            </span>
          </div>
          <h1 className='mt-1  text-2xl font-bold tracking-tight text-accent sm:text-3xl'>
            Welcome back, {session.user?.name || "User"}
          </h1>
          <p className='mt-1 text-sm text-neutral-500'>
            Managing{" "}
            <span className='font-medium text-neutral-800'>
              {currentBusiness.name}
            </span>{" "}
            AI assistant & knowledge pipeline.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Link
            href='/dashboard/knowledge'
            className='inline-flex items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200'
          >
            <Plus className='h-4 w-4' />
            Add Knowledge
          </Link>
          <Link
            href='/dashboard/chat'
            className='inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 shadow-sm'
          >
            <Bot className='h-4 w-4' />
            Test Assistant
          </Link>
        </div>
      </div>

    

      {/* Primary Analytics Stats */}
      <div className='grid gap-5 md:grid-cols-3'>
        {/* Card 1 */}
        <div className='relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs transition hover:shadow-md'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-neutral-500'>
              Total Conversations
            </span>
            <div className='rounded-xl bg-blue-50 p-2.5 text-blue-600'>
              <MessagesSquare className='h-5 w-5' />
            </div>
          </div>
          <div className='mt-4 flex items-baseline gap-2'>
            <p className='text-3xl font-bold tracking-tight text-neutral-900'>
              {conversationCount[0].count}
            </p>
            <span className='text-xs font-medium text-emerald-600'>Active</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className='relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs transition hover:shadow-md'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-neutral-500'>
              Messages
            </span>
            <div className='rounded-xl bg-purple-50 p-2.5 text-purple-600'>
              <MessageSquare className='h-5 w-5' />
            </div>
          </div>
          <div className='mt-4 flex items-baseline gap-2'>
            <p className='text-3xl font-bold tracking-tight text-neutral-900'>
              {messageCount[0].count}
            </p>
            <span className='text-xs font-medium text-neutral-400'>
              Total queries
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className='relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs transition hover:shadow-md'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-neutral-500'>
              Knowledge Documents
            </span>
            <div className='rounded-xl bg-emerald-50 p-2.5 text-emerald-600'>
              <FileText className='h-5 w-5' />
            </div>
          </div>
          <div className='mt-4 flex items-baseline gap-2'>
            <p className='text-3xl font-bold tracking-tight text-neutral-900'>
              {documentCount[0].count}
            </p>
            <span className='text-xs font-medium text-emerald-600'>
              Indexed
            </span>
          </div>
        </div>
      </div>

      <section className='space-y-4'>
        <div>
          <h2 className='text-lg font-semibold'>Message activity</h2>
          <p className='text-sm text-neutral-500'>Last {DAYS} days</p>
        </div>
        <div className='rounded-2xl border border-neutral-200 bg-white p-6'>
          <MessageTrendChart data={messageTrend} />
        </div>
      </section>

      {/* 2-Column Content Grid */}
      <div className='grid gap-8 lg:grid-cols-2'>
        {/* Knowledge Base Section */}
        <section className='flex flex-col rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs'>
          <div className='flex items-center justify-between pb-4'>
            <div>
              <h2 className='text-lg font-bold text-neutral-900'>
                Knowledge Base
              </h2>
              <p className='text-xs text-neutral-500'>
                Documents training your AI context
              </p>
            </div>
            <Link
              href='/dashboard/knowledge'
              className='text-xs font-semibold text-neutral-600 hover:text-black hover:underline'
            >
              View all
            </Link>
          </div>

          <div className='mt-2 divide-y divide-neutral-100'>
            {recentDocuments.length === 0 ? (
              <div className='py-12 text-center'>
                <FileText className='mx-auto h-8 w-8 text-neutral-300' />
                <p className='mt-2 text-sm font-medium text-neutral-600'>
                  No documents indexed
                </p>
                <p className='text-xs text-neutral-400'>
                  Upload PDF, TXT or DOCX to train your assistant.
                </p>
              </div>
            ) : (
              recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className='flex items-center justify-between py-3.5 transition'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600'>
                      <FileText className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-neutral-800 line-clamp-1'>
                        {doc.name}
                      </p>
                      <p className='text-xs text-neutral-400'>
                        {doc.fileType || "Knowledge Doc"}
                      </p>
                    </div>
                  </div>
                  <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700'>
                    <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                    Indexed
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent Conversations Section */}
        <section className='flex flex-col rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs'>
          <div className='flex items-center justify-between pb-4'>
            <div>
              <h2 className='text-lg font-bold text-neutral-900'>
                Recent Chats
              </h2>
              <p className='text-xs text-neutral-500'>
                Live interactions with your AI agent
              </p>
            </div>
            <Link
              href='/dashboard/chat'
              className='text-xs font-semibold text-neutral-600 hover:text-black hover:underline'
            >
              View all
            </Link>
          </div>

          <div className='mt-2 divide-y divide-neutral-100'>
            {recentConversations.length === 0 ? (
              <div className='py-12 text-center'>
                <MessagesSquare className='mx-auto h-8 w-8 text-neutral-300' />
                <p className='mt-2 text-sm font-medium text-neutral-600'>
                  No conversations yet
                </p>
                <p className='text-xs text-neutral-400'>
                  Your chatbot interactions will appear here.
                </p>
              </div>
            ) : (
              recentConversations.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/dashboard/chat/${chat.id}`}
                  className='group flex items-center justify-between py-3.5 transition hover:bg-neutral-50/80 rounded-xl px-2 -mx-2'
                >
                  <div className='flex items-center gap-3'>
                    
                    <div>
                      <p className='text-sm font-semibold text-neutral-800 group-hover:text-black line-clamp-1'>
                        {chat.title || "Untitled Conversation"}
                      </p>
                      <p className='text-xs text-neutral-400'>RAG Chat Query</p>
                    </div>
                  </div>
                  <ArrowUpRight className='h-4 w-4 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-black' />
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
