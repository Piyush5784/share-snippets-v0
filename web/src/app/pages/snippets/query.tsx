"use client";
import { JsonValue } from "@prisma/client/runtime/library";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type snippetsType = {
  user: {
    id: string;
    name: string | null;
    image: string | undefined;
  };
  isStarred: boolean;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  isPublic: boolean;
  description: string | null;
  language: string;
  code: string;
  tags: string[];
};

export type starredSnippetsType = {
  author: {
    name: string | null;
    id: string;
    image: string | undefined;
  };
  isStarred: boolean;
  snippet: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    isPublic: boolean;
    title: string;
    description: string | null;
    language: string;
    code: string;
    tags: string[];
  };
};

export const useGetSnippets = () => {
  return useQuery({
    queryKey: ["get_snippets"],
    queryFn: async () => {
      const res = await axios.get("/api/public-snippets");
      return res.data.data as snippetsType[];
    },
  });
};

export const useGetPrivateSnippets = () => {
  return useQuery({
    queryKey: ["get_snippets_private"],
    queryFn: async () => {
      const res = await axios.get("/api/snippets");
      return res.data.data as snippetsType[];
    },
  });
};

export const useGetSnippetsById = (id: string) => {
  return useQuery({
    queryKey: ["get_snippets_by_id", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/private-snippets/${id}`);
        return res.data.data as snippetsType;
      } catch (error) {
        return null;
      }
    },
    enabled: !!id,
  });
};

export const useGetPublicSnippetById = (id: string) => {
  return useQuery({
    queryKey: ["get_public_snippet_by_id", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/public-snippets/${id}`);
        return res.data.data as snippetsType;
      } catch (error) {
        return null;
      }
    },
    enabled: !!id,
  });
};

export const useGetSavedSnippets = () => {
  return useQuery({
    queryKey: ["get_saved_snippets"],
    queryFn: async () => {
      const res = await axios.get("/api/snippets/starred");
      return res.data.data as starredSnippetsType[];
    },
  });
};

export const useSearchSnippets = (searchQuery: string) => {
  return useQuery({
    queryKey: ["search_snippets", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) {
        return [] as snippetsType[];
      }
      const res = await axios.get(
        `/api/search-snippets?q=${encodeURIComponent(searchQuery)}`
      );
      return res.data.data as snippetsType[];
    },
    enabled: !!searchQuery.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
