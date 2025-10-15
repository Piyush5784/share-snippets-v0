"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Home, LogIn } from "lucide-react";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, { title: string; description: string }> =
    {
      Configuration: {
        title: "Server Configuration Error",
        description:
          "There is a problem with the server configuration. Please contact support.",
      },
      AccessDenied: {
        title: "Access Denied",
        description:
          "You do not have permission to sign in. Please contact the administrator.",
      },
      Verification: {
        title: "Verification Failed",
        description:
          "The verification token has expired or has already been used. Please try signing in again.",
      },
      OAuthSignin: {
        title: "OAuth Sign In Error",
        description:
          "Error occurred during the OAuth sign in process. Please try again.",
      },
      OAuthCallback: {
        title: "OAuth Callback Error",
        description:
          "Error occurred during the OAuth callback. Please try signing in again.",
      },
      OAuthCreateAccount: {
        title: "Account Creation Failed",
        description:
          "Could not create an account with this OAuth provider. The email might already be in use.",
      },
      EmailCreateAccount: {
        title: "Email Account Creation Failed",
        description:
          "Could not create an account with this email. It might already be in use.",
      },
      Callback: {
        title: "Callback Error",
        description:
          "Error occurred during the callback process. Please try again.",
      },
      OAuthAccountNotLinked: {
        title: "Account Not Linked",
        description:
          "This email is already associated with another account. Please sign in using your original method.",
      },
      EmailSignin: {
        title: "Email Sign In Error",
        description:
          "The sign in link is no longer valid. Please request a new one.",
      },
      CredentialsSignin: {
        title: "Sign In Failed",
        description:
          "Invalid email or password. Please check your credentials and try again.",
      },
      SessionRequired: {
        title: "Session Required",
        description: "You must be signed in to access this page.",
      },
      SnippetNotFound: {
        title: "Snippet Not Found",
        description:
          "The snippet you're looking for doesn't exist or has been removed.",
      },
      Default: {
        title: "Something Went Wrong",
        description: "An unexpected error occurred. Please try again.",
      },
    };

  const errorInfo = errorMessages[error || "Default"] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {errorInfo.title}
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {errorInfo.description}
          </p>

          {error && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Error Code:{" "}
                <span className="font-mono font-semibold">{error}</span>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {error !== "SnippetNotFound" && (
            <Button asChild className="w-full" size="lg">
              <Link href="/pages/login">
                <LogIn className="mr-2 h-4 w-4" />
                Try Signing In Again
              </Link>
            </Button>
          )}

          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
        </div>

        {error !== "SnippetNotFound" && (
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help?{" "}
              <Link href="/support" className="text-blue-600 hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
