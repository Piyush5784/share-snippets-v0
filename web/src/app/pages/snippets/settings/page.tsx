"use client";
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useGetApiKey } from "./query";
import Loader from "@/components/custom/Loader";
import { useRouter } from "next/navigation";
import { CopyButton } from "@/components/custom/copy-button";

const Page = () => {
  const session = useSession();

  const user = session.data?.user;

  const { isPending, data, isError, error } = useGetApiKey();
  const router = useRouter();

  const [avatar, setAvatar] = useState<string>(user?.image!);
  const [username, setUsername] = useState<string>(user?.name!);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    router.push(`/pages/error/${error.message}`);
    return null;
  }

  const handleApiKeyCopy = () => {
    if (data) navigator.clipboard.writeText(data);
  };

  return (
    <div className="py-10 text-lg max-w-md">
      {" "}
      {/* Increased font size */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Pic */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              {avatar ? (
                <AvatarImage src={avatar} alt="Profile" />
              ) : (
                <AvatarFallback>
                  {(user?.name && user.name[0]?.toUpperCase()) || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-base"
              >
                Change Photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <Label htmlFor="username" className="text-base">
              Username
            </Label>
            <Input
              id="username"
              disabled
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 text-base"
            />
          </div>

          {/* Email (disabled) */}
          <div>
            <Label htmlFor="email" className="text-base">
              Email
            </Label>
            <Input
              id="email"
              value={user?.email}
              disabled
              className="mt-1 text-base"
            />
          </div>

          {/* API Key */}
          <div>
            <Label className="text-base">API Token</Label>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-zinc-600 text-sm dark:text-zinc-400 w-[30vw] p-2 pl-0 truncate overflow-hidden">
                {data + "..."}
              </p>
              {data && <CopyButton value={data}></CopyButton>}
            </div>
            {/* Always show Generate API Key button */}
            {/* <Button
              variant="default"
              className="mt-2 text-base"
              onClick={handleApiKeyCreate}
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate API Key
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
