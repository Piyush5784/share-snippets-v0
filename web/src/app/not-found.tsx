import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Oops, Something went wrong, <br />
          we will try our best to fix it
        </p>
        <Button asChild>
          <Link href="/"> Return to homepage</Link>
        </Button>{" "}
      </div>
    </div>
  );
}
