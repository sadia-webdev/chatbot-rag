"use client";

import { signIn } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type SignInFormData = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>();

  async function onSubmit(data: SignInFormData) {
    const result = await signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    toast.success("Welcome back");
    redirect("/dashboard");
  }

  return (
    <main className='min-h-screen bg-white'>
      <div className='grid min-h-screen lg:grid-cols-2'>
        {/* Left — Brand / Message */}
        <section className='relative hidden overflow-hidden bg-neutral-950 px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between'>
          <div>
            <Link
              href='/'
              className='flex items-center gap-2 px-2 py-1.5'
            >
              <span className='flex size-6 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground'>
                k
              </span>
              <span className='text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden'>
                kaabe
              </span>
            </Link>
          </div>

          <div className='max-w-xl mb-20 '>
            <p className='mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400'>
              AI for Somali businesses
            </p>

            <h1 className='text-5xl font-semibold leading-[1.05] tracking-tight xl:text-6xl'>
              Your business.
              <br />
              Always ready
              <br />
              to answer.
            </h1>

            <p className='mt-8 max-w-md text-lg leading-7 text-neutral-400'>
              Give your customers instant answers about your products, services,
              prices, and business — even when you're away.
            </p>
          </div>
        </section>

        {/* Right — Sign In */}
        <section className='flex min-h-screen items-center justify-center px-6 py-12 sm:px-10'>
          <div className='w-full max-w-md'>
            {/* Mobile logo */}
            <Link
              href='/'
              className='mb-12 block text-lg font-semibold tracking-tight lg:hidden'
            >
              Somali Business AI
            </Link>

            <div className='mb-10'>
              <h2 className='text-3xl font-semibold tracking-tight text-neutral-950'>
                Create your account
              </h2>

              <p className='mt-2 text-sm text-neutral-500'>
                Start building your AI-powered business assistant.
              </p>
            </div>

            <button
              type='button'
              onClick={async () => {
                await signIn.social({
                  provider: "google",
                  callbackURL: "/dashboard",
                });
              }}
              className='h-12 my-4 w-full rounded-lg cursor-pointer border border-neutral-200 bg-white text-sm font-medium text-neutral-900 transition hover:bg-neutral-50'
            >
              <div className='flex items-center justify-center gap-2'>
                <Image
                  width={20}
                  height={20}
                  src='/google.png'
                  alt='google icon'
                />{" "}
                <span>Continue with Google</span>
              </div>
            </button>

            <div className='my-8 flex  items-center justify-around gap-2 '>
              <span className=' h-0.5 w-50 bg-gray-200'></span>
              <p className='text-neutral-400 '>or</p>
              <span className='h-0.5 w-50  bg-gray-200'></span>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className='space-y-5'
              noValidate
            >
              {/* Email */}
              <div>
                <label
                  htmlFor='email'
                  className='mb-2 block text-sm font-medium text-neutral-900'
                >
                  Email
                </label>
                <input
                  id='email'
                  type='email'
                  placeholder='you@example.com'
                  autoComplete='email'
                  className={`h-12 w-full rounded-lg border text-gray-800 bg-white px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:ring-1 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-neutral-200 focus:border-neutral-950 focus:ring-neutral-950"
                  }`}
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className='mt-1.5 text-xs text-red-500'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor='password'
                  className='mb-2 block text-sm font-medium text-neutral-900'
                >
                  Password
                </label>
                <input
                  id='password'
                  type='password'
                  placeholder='Create a password'
                  autoComplete='new-password'
                  className={`h-12 w-full rounded-lg border text-gray-800 bg-white px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:ring-1 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-neutral-200 focus:border-neutral-950 focus:ring-neutral-950"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                    },
                  })}
                />
                {errors.password && (
                  <p className='mt-1.5 text-xs text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                disabled={isSubmitting}
                type='submit'
                className='h-12 w-full rounded-lg bg-accent px-4 text-sm font-medium text-white transition hover:bg-accent/80 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isSubmitting ? "Signin in..." : "Sign in"}
              </button>
            </form>

            <p className='mt-8 text-center text-sm text-neutral-500'>
              doesn't have an account?{" "}
              <Link
                href='/sign-up'
                className='font-medium text-accent underline underline-offset-4 hover:text-accent/80'
              >
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
