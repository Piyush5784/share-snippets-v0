"use client";
import SnippetsList from "@/components/custom/SnippetList";
import { useGetSavedSnippets } from "../query";

const Page = () => {
  const { data, isPending, error } = useGetSavedSnippets();

  const mappedData =
    data?.map((item) => ({
      ...item.snippet,
      user: {
        ...item.author,
        image: item?.author?.image ?? undefined,
      },
      isStarred: true,
    })) || [];

  return <SnippetsList data={mappedData} isPending={isPending} error={error} />;
};

export default Page;
