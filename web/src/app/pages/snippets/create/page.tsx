"use client";
import React from "react";
import SnippetForm from "./snippetsForm";

const Create = () => {
  return (
    <SnippetForm
      title={""}
      description={""}
      isPublic={true}
      language={""}
      code={""}
      tags={[]}
      mode="create"
    />
  );
};

export default Create;
