"use client";
import React from "react";
import { useSelectedCodeStore } from "@/store/useSelectedCode";
import SnippetForm from "../create/snippetsForm";

const Edit = () => {
  const { title, description, isPublic, language, code, tags, id } =
    useSelectedCodeStore();

  return (
    <SnippetForm
      id={id}
      title={title}
      description={description}
      isPublic={isPublic}
      language={language}
      code={code}
      tags={tags}
      mode="edit"
    />
  );
};

export default Edit;
