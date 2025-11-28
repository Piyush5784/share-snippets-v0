"use client";
import React from "react";
import { useGetApiKey } from "../settings/query";
import { Input } from "@/components/ui/input";
import Loader from "@/components/custom/Loader";
import ErrorPage from "../../error/page";
import { CopyButton } from "@/components/custom/copy-button";

const Page = () => {
  const { isPending, data, isError, error } = useGetApiKey();

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="min-h-screen rounded-xl bg-background text-foreground py-12 px-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Share Snippets Extension</h1>
          <p className="text-xl text-muted-foreground">
            Seamlessly share code snippets across your development workflow
          </p>
        </div>

        {/* Installation Section */}
        <div className="bg-background border border-border rounded-xl shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
              1
            </span>
            Install the Extension
          </h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Install the Share Snippets extension for your code editor:
            </p>
            <div className="bg-muted rounded-lg p-4 border-l-4 border-primary">
              <code className="text-sm font-mono">
                # For VS Code
                <br />
                Search on VS code extension share-snippets-by-Piyush5784 <br />{" "}
                or
                <br /> ext install Piyush5784.share-snippets-by-Piyush5784
              </code>
            </div>
            <p className="text-sm text-muted-foreground">
              Or search for "Share Snippets" in your editor's extension
              marketplace
            </p>
          </div>
        </div>

        {/* API Key Section */}
        <div className="bg-background border border-border rounded-xl shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
              2
            </span>
            Get Your API Key
          </h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Navigate to your account settings to copy your API key:
            </p>
            <div className="bg-muted rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2">Your API Key</h3>
                  <Input
                    disabled
                    value={data ?? ""}
                    className="bg-background w-full border border-border rounded px-3 py-2 font-mono text-sm"
                  />
                </div>
                <CopyButton value={data} />
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-muted border border-border rounded-lg p-4">
              <div className="mt-0.5">⚠️</div>
              <p className="text-sm">
                Keep your API key secure and never share it publicly
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="bg-background border border-border rounded-xl shadow p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
              3
            </span>
            Configure the Extension
          </h2>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Paste your API key in the extension settings:
            </p>

            <div className="bg-muted border border-border rounded-lg p-4">
              <div className="flex items-center">
                <div className="mr-3">✅</div>
                <div>
                  <p className="font-medium">You're all set!</p>
                  <p className="text-sm text-muted-foreground">
                    Open the command palette (Ctrl+Shift+P / Cmd+Shift+P),
                    search for "Share Snippets", and start sharing your code!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-xl shadow p-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3"></span>
            Demo (How to install and use extension)
          </h2>
          <div className="space-y-6">
            <video
              src={
                "https://res.cloudinary.com/dzf9kamfw/video/upload/v1764288807/Screencast_from_2025-11-28_05-32-32_pc5hdd.webm"
              }
              controls
              autoPlay
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
