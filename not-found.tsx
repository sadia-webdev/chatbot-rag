// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className='min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-6'>
      <div className='max-w-md w-full text-center space-y-6'>
        {/* Status Badge */}
        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider'>
          404 Error
        </div>

        {/* Heading & Text */}
        <div className='space-y-2'>
          <h1 className='text-4xl font-bold tracking-tight text-white sm:text-5xl'>
            Page not found
          </h1>
          <p className='text-slate-400 text-sm leading-relaxed'>
            Sorry, the page you are looking for does not exist, was removed, or
            is temporarily unavailable.
          </p>
        </div>

        {/* Actions */}
        <div className='flex flex-col sm:flex-row items-center justify-center gap-3 pt-2'>
          <Link
            href='/'
            className='w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors duration-200 shadow-lg shadow-emerald-900/20'
          >
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className='w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-sm transition-colors duration-200'
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
