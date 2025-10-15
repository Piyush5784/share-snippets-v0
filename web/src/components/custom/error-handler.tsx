"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthErrorHandlerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      router.push(`/pages/error?error=${error}`);
      console.error("Authentication error:", error);
    }
  }, [searchParams, router]);

  return null;
}

export function AuthErrorHandler() {
  return (
    <Suspense fallback={null}>
      <AuthErrorHandlerContent />
    </Suspense>
  );
}
