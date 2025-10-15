"use client";
import { JsonValue } from "@prisma/client/runtime/library";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type snippetsType = {
  user: {
    id: string;
    name: string | null;
    image: string;
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
  user: {
    name: string | null;
    id: string;
    image: string | null;
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
      console.log(res.data.data);
      return res.data.data as starredSnippetsType[];
    },
  });
};
