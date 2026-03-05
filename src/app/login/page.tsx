import { signInAction } from "@/lib/actions/auth";
import Image from "next/image";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    redirectTo?: string;
  }>;
};

function getSafeRedirectPath(path?: string): string {
  if (path && path.startsWith("/") && !path.startsWith("//")) {
    return path;
  }
  return "/dashboard";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = getSafeRedirectPath(params.redirectTo);
  const hasError = Boolean(params.error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f4f6] px-4 py-8">
      <section className="w-[94vw] rounded-2xl border border-[#e5e7eb] bg-white px-6 py-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] sm:w-[90vw] sm:px-8 sm:py-12 md:w-[78vw] md:max-w-[720px] md:px-10 md:py-14 lg:w-1/3 lg:min-w-[430px] lg:max-w-[470px]">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-[#111827]">
          <Image
            src="/mm-monogram-logo-hexagon-style-vector-27349645.avif"
            alt="Manage Me logo"
            width={56}
            height={56}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <h1 className="text-center text-[clamp(1.9rem,3vw,2.65rem)] font-semibold text-[rgb(36,31,33)]">
          Manage Me <span className="mx-1 font-light text-[#d1d5db]">|</span> Login
        </h1>

        <form action={signInAction} className="mt-10 space-y-5">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div>
            <label className="mb-2 block text-sm font-semibold text-[rgb(36,31,33)]">Login</label>
            <div className="relative flex items-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute left-3 h-[18px] w-[18px] text-[#6b7280]"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                name="login"
                type="text"
                autoComplete="username"
                placeholder="login"
                required
                className="h-12 w-full rounded-lg border border-[#e5e7eb] bg-white pl-10 pr-3 text-base text-[#1f1f1f] outline-none transition-colors placeholder:text-[#6b7280] focus:border-[#6b7280]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[rgb(36,31,33)]">Password</label>
            <div className="relative flex items-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute left-3 h-[18px] w-[18px] text-[#6b7280]"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                minLength={8}
                placeholder="password"
                required
                className="h-12 w-full rounded-lg border border-[#e5e7eb] bg-white pl-10 pr-3 text-base text-[#1f1f1f] outline-none transition-colors placeholder:text-[#6b7280] focus:border-[#6b7280]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 h-12 w-full rounded-lg border border-[rgb(36,31,33)] bg-[rgb(36,31,33)] text-[22px] font-medium text-[#f2f2f2] cursor-pointer"
          >
            Enter
          </button>

          {hasError ? (
            <p className="text-center text-sm text-[#ef4444]">Login failed. Incorrect login or password.</p>
          ) : null}
        </form>
      </section>
    </main>
  );
}
