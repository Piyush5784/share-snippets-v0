"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import Loader from "@/components/custom/Loader";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CopyButton } from "@/components/custom/copy-button";
import { BACKEND_URL } from "@/lib/config";
import { useGetPublicSnippetById } from "../../snippets/query";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/custom/ShareButtont";

const Page = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const router = useRouter();

  const { data, isPending, isError, error } = useGetPublicSnippetById(
    typeof id === "string" ? id : ""
  );

  if (isPending) {
    return <Loader />;
  }

  if (isError || !data) {
    router.push(`/pages/error?error=SnippetNotFound`);
    return null;
  }

  return (
    <div className="flex flex-col text-white items-center justify-center h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-zinc-900 dark:to-zinc-800 rounded-xl p-6">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4 w-full ">
            <div className="w-full">
              <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                {data.title || "Snippet"}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Language: <span className="font-medium">{data.language}</span>
              </p>
              <div className="flex items-center gap-2 justify-between w-full  border-zinc-200 dark:border-zinc-700 mt-2">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={data.user.image}
                      alt={data.user.name || "User"}
                    />
                    <AvatarFallback>
                      {data.user.name ? data.user.name[0] : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    By {data.user.name || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <CopyButton value={data.code} />
                  <ShareButton
                    value={`${BACKEND_URL}/pages/snippet/${data.id}`}
                  />
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-semibold">
                    Read Only
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700  bg-zinc-50 dark:bg-zinc-800">
          <Editor
            language={data.language.toLowerCase()}
            theme={theme == "light" ? "vs-light" : "vs-dark"}
            value={data.code}
            options={{
              readOnly: true,
              padding: { top: 16 },
              minimap: { enabled: false },
              contextmenu: true,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              wrappingIndent: "same",
              fontSize: 15,
            }}
            height="70vh"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
