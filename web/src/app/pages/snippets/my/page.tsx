"use client";
import SnippetsList from "@/components/custom/SnippetList";
import { useGetPrivateSnippets } from "../query";
import { FileText } from "lucide-react";

const Page = () => {
  const { data, isPending, error } = useGetPrivateSnippets();

  if (data?.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center text-gray-500">
          <FileText size={64} className="mx-auto mb-4 text-gray-300" />
          <div className="text-xl font-medium">No snippets found</div>
          <div className="text-base text-gray-400 mt-2">
            You haven't added any snippets yet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SnippetsList data={data || []} isPending={isPending} error={error} />
    </div>
  );
};

export default Page;
