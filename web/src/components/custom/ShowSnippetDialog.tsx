"use client";
import { useRef, MouseEvent, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Edit, Star, X } from "lucide-react";
import { CopyButton } from "@/components/custom/copy-button";
import { useTheme } from "next-themes";
import { snippetsType } from "@/app/pages/snippets/query";
import { BACKEND_URL } from "@/lib/config";
import { ShareButton } from "./ShareButtont";

interface SnippetViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippet: snippetsType | null;
  isStarred: boolean;
  onStarToggle: (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
  onEdit: () => void;
  currentUserId?: string;
}

const SnippetViewDialog = ({
  open,
  onOpenChange,
  snippet,
  isStarred,
  onStarToggle,
  onEdit,
  currentUserId,
}: SnippetViewDialogProps) => {
  const { theme } = useTheme();
  const dialogEditorRef = useRef<any>(null);

  const handleDialogEditorMount = async (editor: any) => {
    dialogEditorRef.current = editor;
    await dialogEditorRef.current
      .getAction("editor.action.formatDocument")
      .run();
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onOpenChange(false);
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [open, onOpenChange]);

  if (!snippet || !open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center "
      onClick={() => onOpenChange(false)}
    >
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

      {/* Dialog Content */}
      <div
        className="relative z-50 w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 mx-4 max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <X size={20} />
        </Button>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-4 w-full">
            <div className="w-full">
              <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 pr-10">
                {snippet.title}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Language:{" "}
                <span className="font-medium">{snippet.language}</span>
              </p>
              <div className="flex items-center gap-2 justify-between w-full border-zinc-200 dark:border-zinc-700 mt-2">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={snippet.user.image}
                      alt={snippet.user.name || "User"}
                    />
                    <AvatarFallback>
                      {snippet.user.name ? snippet.user.name[0] : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    By {snippet.user.name || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    onClick={onStarToggle}
                  >
                    <Star
                      className={isStarred ? "text-yellow-400" : ""}
                      fill={isStarred ? "currentColor" : "none"}
                      stroke={isStarred ? "none" : "currentColor"}
                      size={16}
                    />
                  </Button>
                  {currentUserId === snippet.user.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                      onClick={onEdit}
                    >
                      <Edit size={16} />
                    </Button>
                  )}
                  {snippet.code && <CopyButton value={snippet.code} />}
                  <ShareButton
                    value={`${BACKEND_URL}/pages/snippet/${snippet.id}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
          {snippet.code ? (
            <Editor
              onMount={handleDialogEditorMount}
              language={snippet.language.toLowerCase()}
              theme={theme === "light" ? "vs-light" : "vs-dark"}
              value={snippet.code}
              options={{
                readOnly: true,
                padding: { top: 16 },
                minimap: { enabled: false },
                contextmenu: true,
                wordWrap: "on",
                scrollBeyondLastLine: false,
                wrappingIndent: "same",
                fontSize: 15,
              }}
              height="70vh"
            />
          ) : (
            <div className="h-[70vh] flex items-center justify-center text-zinc-500 dark:text-zinc-400">
              No code available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnippetViewDialog;
