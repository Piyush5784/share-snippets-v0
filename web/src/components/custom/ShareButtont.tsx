import { cn } from "@/lib/utils";
import { CheckIcon, ExternalLinkIcon, Share2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Link from "next/link";

export async function shareContent(value: string) {
  if (navigator.share) {
    try {
      await navigator.share({ text: value });
    } catch (e) {
      // Sharing cancelled or failed
    }
  } else {
    // fallback: copy to clipboard
    await navigator.clipboard.writeText(value);
    toast.success("Copied");
  }
}

export function ShareButton({
  value,
  className,
  ...props
}: {
  value: string;
  className?: string;
}) {
  const [hasShared, setHasShared] = useState(false);

  useEffect(() => {
    if (hasShared) {
      const timer = setTimeout(() => {
        setHasShared(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasShared]);

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "relative z-10 h-8 w-8 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100",
        className
      )}
      onClick={async () => {
        await shareContent(value);
        setHasShared(true);
      }}
      {...props}
    >
      <span className="sr-only">Share</span>
      {hasShared ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <Share2Icon className="h-4 w-4" />
      )}
    </Button>
  );
}

export const ExternalLink = ({ url }: { url: string }) => {
  return (
    <>
      <Button
        asChild
        size="icon"
        variant="ghost"
        className={cn(
          "relative z-10 h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
        )}
      >
        <Link href={url} target="_blank">
          {" "}
          <ExternalLinkIcon />
        </Link>
      </Button>
    </>
  );
};
