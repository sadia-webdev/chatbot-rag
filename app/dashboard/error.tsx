"use client";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center p-8">
      <div className="max-w-full text-center">
        <h1 className="text-2xl font-semibold">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm text-neutral-500">
          We couldn&apos;t load your dashboard. Please check your
          internet connection and try again.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/80"
        >
          Try again
        </button>
      </div>
    </main>
  );
}