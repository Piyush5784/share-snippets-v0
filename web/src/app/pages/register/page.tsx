import { nextAuthOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import RegisterPage from "./RegisterPage";

const RegisterWrapper = async () => {
  const session = await getServerSession(nextAuthOptions);
  return <RegisterPage session={session} />;
};

export default RegisterWrapper;
