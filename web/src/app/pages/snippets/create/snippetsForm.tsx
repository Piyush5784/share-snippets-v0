"use client";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import React, { useRef, useState } from "react";
import { monacoLanguages } from "@/lib/languageSupported";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkle } from "lucide-react";
import { toast } from "sonner";
import { useSubmitCode, useSubmitEditedCode } from "@/hooks/useCode";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LanguageSelect from "@/components/custom/ResuableSelect";
import { useSession } from "next-auth/react";

type SnippetFormProps = {
  title?: string;
  description?: string;
  isPublic?: boolean;
  language?: string;
  code?: string;
  tags?: string[];
  id?: string;
  mode?: "create" | "edit";
};

const SnippetForm = ({
  title: initialTitle = "",
  description: initialDescription = "",
  isPublic: initialIsPublic = true,
  language: initialLanguage,
  code: initialCode = "",
  tags: initialTags = [],
  id,
  mode = "create",
}: SnippetFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [language, setLanguage] = useState("typescript");
  const [code, setCode] = useState(initialCode);
  const [tags, setTags] = useState<string[]>(initialTags);
  const editorRef = useRef<any>(null);

  const postQuery = useSubmitCode();

  const updateQuery = useSubmitEditedCode();

  const { theme } = useTheme();

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleBeautify = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !code) {
      return toast.error("Code is required", {
        description: "Please write some code",
      });
    }

    let formattedCode = code;
    if (editorRef.current) {
      await editorRef.current.getAction("editor.action.formatDocument").run();
      formattedCode = editorRef.current.getValue();
    }

    const snippet = {
      title,
      description,
      isPublic,
      language,
      code: formattedCode,
      tags,
    };
    if (mode == "create") {
      postQuery.mutate(snippet);
    } else {
      updateQuery.mutate({ snippet, id });
    }
  };

  return (
    <div className="flex items-center text-2xl justify-center p-4 h-full rounded-xl border border-border bg-background transition-colors">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full max-w-6xl p-6 bg-card rounded-lg border border-border shadow-xl transition-colors"
      >
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Nodejs Express Implementation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Nodejs implementation"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="tags"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Tags
          </label>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-md border"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((_, i) => i !== index))}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            id="tags"
            placeholder="Type a tag and press Enter"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = e.currentTarget.value.trim();
                if (value && !tags.includes(value)) {
                  setTags([...tags, value]);
                  e.currentTarget.value = "";
                }
              }
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label
            htmlFor="public-toggle"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Public
          </label>
          <button
            id="public-toggle"
            type="button"
            aria-pressed={isPublic}
            onClick={() => setIsPublic((prev) => !prev)}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              isPublic ? "bg-primary" : "bg-input"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-background shadow-md transition-transform ${
                isPublic ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <label
                htmlFor="code"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Code
              </label>
              <div className="w-48">
                <LanguageSelect
                  onChange={setLanguage}
                  value={language}
                  theme={theme as "dark" | "light"}
                />
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <Button
                type="button"
                variant={"outline"}
                onClick={handleBeautify}
              >
                <Sparkle />
              </Button>
              <div>
                <Button
                  type="submit"
                  disabled={postQuery.isPending || updateQuery.isPending}
                >
                  {mode === "create" ? "Create Snippet" : "Update"}
                  {postQuery.isPending ||
                    (updateQuery.isPending && (
                      <Loader2 className="animate-spin" size={50} />
                    ))}
                </Button>
              </div>
            </div>
          </div>
          <div className="h-120 flex">
            <Editor
              onMount={handleEditorMount}
              language={language.toLowerCase()}
              theme={theme === "dark" ? "vs-dark" : "light"}
              value={code}
              onChange={(value) => setCode(value ?? "")}
              options={{
                padding: {
                  top: 5,
                },
                allowOverflow: false,
                readOnly: false,
                minimap: { enabled: true },
                contextmenu: true,
                scrollBeyondLastLine: true,
                wrappingIndent: "same",
                wordWrap: "on",
                fontSize: 15,
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SnippetForm;
