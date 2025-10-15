import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
type snippet = {
  title: string;
  description: string;
  isPublic: boolean;
  language: string;
  code: string;
  tags: string[];
};

export const useSubmitCode = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (snippet: snippet) => {
      const res = await axios.post("/api/snippets", snippet);
      console.log(res);
      if (res.data.success) {
        toast.success("Snippet created successfully");
        router.push("/pages/snippets");
      }
    },
    onSuccess: (data) => {
      console.log("snippet created:", data);
      queryClient.invalidateQueries({ queryKey: ["get_snippets"] });
    },
    onError: (error) => {
      console.error("Error creating snippet:", error);
    },
  });
};

export const useSaveCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (!id) return;
      const res = await axios.post(`/api/snippets/starred`, { snippetId: id });
      console.log(res);
      if (res.data.success) {
        toast.success("Snippet successfully saved");
      }
    },
    onSuccess: (data) => {
      console.log("snippet created:", data);
      queryClient.invalidateQueries({ queryKey: ["get_saved_snippets"] });
    },
    onError: (error) => {
      console.error("Error editing snippet:", error);
    },
  });
};

export const useSubmitEditedCode = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      snippet,
      id,
    }: {
      snippet: snippet;
      id: string | undefined;
    }) => {
      if (!id) return;
      const res = await axios.patch(`/api/snippets?id=${id}`, snippet);
      console.log(res);
      if (res.data.success) {
        toast.success("Snippet updated successfully");
        router.push("/pages/snippets");
      }
    },
    onSuccess: (data) => {
      console.log("snippet created:", data);
      queryClient.invalidateQueries({ queryKey: ["get_snippets"] });
    },
    onError: (error) => {
      console.error("Error editing snippet:", error);
    },
  });
};
