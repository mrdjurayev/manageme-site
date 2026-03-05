"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="mt-2 h-12 w-full rounded-lg border border-[rgb(36,31,33)] bg-[rgb(36,31,33)] text-[22px] font-medium text-[#f2f2f2] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Signing in..." : "Enter"}
    </button>
  );
}
