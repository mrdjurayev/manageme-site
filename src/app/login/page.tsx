import { signInAction } from "@/lib/actions/auth";
import Image from "next/image";
import { SubmitButton } from "./submit-button";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    redirectTo?: string;
  }>;
};

const LOGIN_INPUT_CLASS =
  "ui-text-body h-12 w-full rounded-lg border border-[var(--ui-border)] bg-[var(--ui-surface)] pl-10 pr-3 text-[var(--ui-text-primary)] outline-none transition-colors placeholder:text-[var(--ui-text-secondary)] focus:border-[var(--ui-border)] focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0";

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
    <main className="flex min-h-screen items-center justify-center bg-[var(--ui-page-bg)] px-4 py-8">
      <section
        className="min-h-[536px] w-[94vw] rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-surface)] px-6 pb-10 pt-8 sm:w-[90vw] sm:px-8 sm:pb-12 sm:pt-10 md:min-h-[620px] md:w-[74vw] md:max-w-[680px] md:px-10 md:pb-16 md:pt-12 lg:min-h-0 lg:w-1/3 lg:min-w-[430px] lg:max-w-[470px]"
        style={{ boxShadow: "0 4px 6px -1px var(--ui-shadow-strong), 0 2px 4px -1px var(--ui-shadow-soft)" }}
      >
        <div className="mx-auto mb-6 flex h-[92px] w-[92px] items-center justify-center overflow-hidden bg-[var(--ui-primary)]">
          <Image
            src="/manageme-white.png"
            alt="Manage Me logo"
            width={92}
            height={92}
            className="h-full w-full object-contain"
            priority
          />
        </div>

        <h1 className="ui-text-display whitespace-nowrap text-center font-semibold text-[var(--ui-text-primary)]">
          Manage Me <span className="mx-1 font-light text-[var(--ui-border)]">|</span> Log In
        </h1>

        <form action={signInAction} className="mt-10 space-y-5">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div>
            <label className="ui-text-form-label mb-2 block font-semibold text-[var(--ui-text-primary)]">Login</label>
            <div className="relative flex items-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute left-3 h-[18px] w-[18px] text-[var(--ui-text-secondary)]"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                name="login"
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                maxLength={64}
                placeholder="login"
                required
                className={LOGIN_INPUT_CLASS}
              />
            </div>
          </div>

          <div>
            <label className="ui-text-form-label mb-2 block font-semibold text-[var(--ui-text-primary)]">Password</label>
            <div className="relative flex items-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute left-3 h-[18px] w-[18px] text-[var(--ui-text-secondary)]"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                minLength={8}
                maxLength={256}
                placeholder="password"
                required
                className={LOGIN_INPUT_CLASS}
              />
            </div>
          </div>

          <SubmitButton />

          {hasError ? (
            <p className="ui-text-body-sm text-center text-[var(--ui-danger)]">Login failed. Incorrect login or password.</p>
          ) : null}
        </form>
      </section>
    </main>
  );
}
