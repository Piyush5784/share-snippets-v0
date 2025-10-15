"use client";
import SnippetsList from "@/components/custom/SnippetList";
import { useGetSnippets } from "./query";
import Loader from "@/components/custom/Loader";

const Page = () => {
  const { data, isPending, error } = useGetSnippets();

  return <SnippetsList data={data || []} isPending={isPending} error={error} />;
};

export default Page;
