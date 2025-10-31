"use client";
import Loader from "@/components/custom/Loader";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Eye, Search, Star, X } from "lucide-react";
import { CopyButton } from "@/components/custom/copy-button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useSelectedCodeStore } from "@/store/useSelectedCode";
import { useSession } from "next-auth/react";
import { snippetsType, useSearchSnippets } from "@/app/pages/snippets/query";
import { Separator } from "../ui/separator";
import { BACKEND_URL } from "@/lib/config";
import { ShareButton } from "./ShareButtont";
import DeleteDialog from "./DeleteDialog";
import { useSaveCode } from "@/hooks/useCode";
import SnippetViewDialog from "./ShowSnippetDialog";
import useDebounce from "@/hooks/useDebounce";

interface SnippetsListProps {
  data: snippetsType[];
  isPending: boolean;
  error: Error | null;
}

const SnippetsList = ({ data, isPending, error }: SnippetsListProps) => {
  const { theme } = useTheme();
  const router = useRouter();

  const editorRef = useRef<any>(null);
  const [selected, setSelectedCode] = useState<snippetsType | null>(null);
  const [starredSnippets, setStarredSnippets] = useState<Set<string>>(
    new Set()
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search query for backend search
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Backend search using debounced query
  const { data: backendSearchResults, isPending: isBackendSearchPending } =
    useSearchSnippets(debouncedSearchQuery);

  const session = useSession();
  const { mutate } = useSaveCode();
  const {
    setCode,
    setDescription,
    setIsPublic,
    setLanguage,
    setTags,
    setTitle,
    setId,
    setIsStarred,
  } = useSelectedCodeStore();

  // Local search function for immediate filtering
  const localSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((snippet) => {
      return (
        snippet.title.toLowerCase().includes(query) ||
        snippet.description?.toLowerCase().includes(query) ||
        snippet.language.toLowerCase().includes(query) ||
        snippet.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        snippet.user.name?.toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery]);

  // Combine local and backend search results
  const displayData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    // Start with local results for immediate response
    const localResults = localSearchResults;

    // If we have backend results, merge them (avoiding duplicates)
    if (backendSearchResults && backendSearchResults.length > 0) {
      const localIds = new Set(localResults.map((item) => item.id));
      const additionalResults = backendSearchResults.filter(
        (item) => !localIds.has(item.id)
      );
      return [...localResults, ...additionalResults];
    }

    return localResults;
  }, [data, searchQuery, localSearchResults, backendSearchResults]);

  // Clear search function
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Determine if we're still loading backend results
  const isSearching =
    searchQuery.trim() !== "" && debouncedSearchQuery !== searchQuery;
  const isBackendLoading =
    searchQuery.trim() !== "" &&
    debouncedSearchQuery === searchQuery &&
    isBackendSearchPending;

  const handleEditorMount = async (editor: any) => {
    editorRef.current = editor;
    await editorRef.current.getAction("editor.action.formatDocument").run();
  };

  const handleView = () => {
    setIsViewDialogOpen(true);
  };

  const handleStarred = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selected?.id) return;

    try {
      setStarredSnippets((prev) => {
        const next = new Set(prev);
        if (next.has(selected.id)) {
          next.delete(selected.id);
        } else {
          next.add(selected.id);
        }
        return next;
      });

      mutate({ id: selected.id });
      setSelectedCode((prev) =>
        prev
          ? {
              ...prev,
              isStarred: !prev.isStarred,
            }
          : null
      );
    } catch (error) {
      setStarredSnippets((prev) => {
        const next = new Set(prev);
        if (next.has(selected.id)) {
          next.delete(selected.id);
        } else {
          next.add(selected.id);
        }
        return next;
      });
      console.error("Failed to update star status:", error);
    }
  };

  const handleEdit = async () => {
    if (!selected) return;
    const editor = await editorRef.current;
    if (editor) {
      editor
        .getAction("editor.action.formatDocument")
        .run()
        .then(() => {
          const formattedCode = editor.getValue();
          setCode(formattedCode ?? selected.code);
          setDescription(selected.description ?? "");
          setIsPublic(selected.isPublic);
          setLanguage(selected.language);
          setId(selected.id);
          setTitle(selected.title);
          setTags(selected.tags);
          setIsStarred(selected.isStarred);
        });
    }

    router.push("/pages/snippets/edit");
  };

  useEffect(() => {
    if (
      displayData &&
      displayData.length > 0 &&
      (selected === null ||
        !displayData.find((snippet) => snippet.id === selected.id))
    ) {
      setSelectedCode(displayData[0]);
    }
  }, [displayData, selected]);

  useEffect(() => {
    if (data && data.length > 0) {
      const starred = new Set(
        data.filter((snippet) => snippet.isStarred).map((snippet) => snippet.id)
      );
      setStarredSnippets(starred);
    }
  }, [data]);

  const checkStarred = useMemo(() => {
    return selected ? starredSnippets.has(selected.id) : false;
  }, [selected, starredSnippets]);

  if (isPending) {
    return <Loader />;
  }

  if (error) {
    router.push(`/pages/error/${error.message}`);
    return null;
  }

  if (data.length == 0) {
    return (
      <div className="text-center text-zinc-500 dark:text-zinc-400 py-10">
        <h3 className="text-lg font-medium mb-2">No snippets found</h3>
        <p className="text-sm">There are no snippets to display.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row h-[88vh] overflow-hidden">
        {/* Snippets List */}
        <div className="w-full md:w-1/2 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search snippets by title, description, language, tags, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            {searchQuery && (
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {isSearching ||
                    (isBackendLoading && (
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                        Searching...
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Snippets Grid */}
          <div className="flex-1 grid grid-cols-1 gap-6 p-4 overflow-y-auto">
            {displayData.length > 0 ? (
              displayData.map((snippet) => (
                <div
                  key={snippet.id}
                  onClick={() => setSelectedCode(snippet)}
                  className={`bg-white cursor-pointer dark:bg-zinc-900 w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 border ${
                    selected?.id === snippet.id
                      ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 flex-1">
                        {snippet.title}
                      </p>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {snippet.description || "No description"}
                    </p>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={snippet.user.image}
                        alt={snippet.user.name || "User"}
                      />
                      <AvatarFallback className="text-xs">
                        {snippet.user.name
                          ? snippet.user.name[0].toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      {snippet.user.name || "Unknown User"}
                    </span>
                  </div>

                  {/* Tags */}
                  {snippet.tags && snippet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {snippet.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {snippet.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          +{snippet.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer Info */}
                  <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="font-medium">{snippet.language}</span>
                    <span>
                      {new Date(snippet.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-zinc-500 dark:text-zinc-400 py-10">
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery
                    ? "No matching snippets found"
                    : "No snippets found"}
                </h3>
                <p className="text-sm">
                  {searchQuery
                    ? `Try adjusting your search terms or clear the search to see all snippets.`
                    : "There are no snippets to display."}
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSearch}
                    className="mt-3"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Snippet Detail View */}
        <div className="p-4 h-[88vh] ">
          <div className="bg-white  h-full dark:bg-zinc-900 rounded-xl shadow-lg transition-shadow duration-200 p-6 border border-zinc-200 dark:border-zinc-800">
            {selected ? (
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-full">
                      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                        {selected.title}
                      </h1>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Language:{" "}
                        <span className="font-medium">{selected.language}</span>
                      </p>
                      <div className="w-full flex items-center justify-between">
                        <p className="text-zinc-600 dark:text-zinc-400 w-[30vw] p-2 pl-0 truncate overflow-hidden">
                          {BACKEND_URL}/pages/snippet/{selected.id}
                        </p>
                        <ShareButton
                          value={`${BACKEND_URL}/pages/snippet/${selected.id}`}
                        />
                      </div>

                      <div className="flex items-center gap-2 justify-between w-full border-zinc-200 dark:border-zinc-700 mt-2">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage
                              src={selected.user.image}
                              alt={selected.user.name || "User"}
                            />
                            <AvatarFallback>
                              {selected.user.name ? selected.user.name[0] : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">
                            By {selected.user.name || "Unknown"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                            onClick={(e) => handleStarred(e)}
                          >
                            <Star
                              className={checkStarred ? "text-yellow-400" : ""}
                              fill={checkStarred ? "currentColor" : "none"}
                              stroke={checkStarred ? "none" : "currentColor"}
                              size={16}
                            />
                          </Button>
                          {session.data?.user?.id == selected.user.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                              onClick={handleEdit}
                            >
                              <Edit size={16} />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                            onClick={handleView}
                          >
                            <Eye size={16} />
                          </Button>
                          {selected.code && (
                            <CopyButton value={selected.code} />
                          )}
                          <ShareButton
                            value={`${BACKEND_URL}/pages/snippet/${selected.id}`}
                          />
                          <DeleteDialog
                            show={session.data?.user?.id == selected.user.id}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editor */}
                <div className="flex-1 rounded-lg w-[45vw] border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                  {selected.code ? (
                    <Editor
                      onMount={handleEditorMount}
                      language={selected.language.toLowerCase()}
                      theme={theme === "light" ? "vs-light" : "vs-dark"}
                      value={selected.code}
                      options={{
                        readOnly: true,
                        autoIndent: "advanced",
                        padding: { top: 16 },
                        minimap: { enabled: false },
                        contextmenu: true,
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        wrappingIndent: "same",
                        fontSize: 15,
                      }}
                      height="100%"
                      width={"100%"}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                      No code available
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-zinc-500 dark:text-zinc-400">
                  <h3 className="text-lg font-medium mb-2">Select a snippet</h3>
                  <p className="text-sm">
                    Choose a snippet from the list to view its details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Dialog */}
      <SnippetViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        snippet={selected}
        isStarred={selected ? starredSnippets.has(selected.id) : false}
        onEdit={handleEdit}
        onStarToggle={handleStarred}
        currentUserId={selected?.user.id}
        key={selected?.id}
      />
    </>
  );
};

export default SnippetsList;
