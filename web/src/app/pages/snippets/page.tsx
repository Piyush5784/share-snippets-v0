"use client";
import SnippetsList from "@/components/custom/SnippetList";
import { useGetSnippets } from "./query";
import Loader from "@/components/custom/Loader";
import { useState } from "react";

const Page = () => {
  const [search, setSearch] = useState("");

  const { data, isPending, error } = useGetSnippets();

  return <SnippetsList data={data || []} isPending={isPending} error={error} />;
};

export default Page;
