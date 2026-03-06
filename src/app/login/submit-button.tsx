"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="mt-2 h-12 w-full rounded-lg border border-[rgb(36,31,33)] bg-[rgb(36,31,33)] text-[22px] font-medium text-[#f2f2f2] cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:bg-[rgb(36,31,33)] hover:bg-[rgb(36,31,33)] disabled:cursor-not-allowed disabled:bg-[rgb(36,31,33)]"
    >
      {pending ? (
        <span className="inline-flex items-center justify-center" aria-label="Loading">
          <svg
            className="h-6 w-6 animate-spin text-[#f2f2f2]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-20"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ) : (
        "Enter"
      )}
    </button>
  );
}
