"use client";
import SnippetsList from "@/components/custom/SnippetList";
import { useGetSavedSnippets, useGetSnippets } from "../query";

const Page = () => {
  const { data, isPending, error } = useGetSavedSnippets();

  const mappedData =
    data?.map((item) => ({
      ...item.snippet,
      user: {
        ...item.user,
        image: item.user.image ?? "",
      },
      isStarred: true,
    })) || [];

  return <SnippetsList data={mappedData} isPending={isPending} error={error} />;
};

export default Page;
