import { nextAuthOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import Topbar from "./Topbar";

const TopbarWrapper = async () => {
  const session = await getServerSession(nextAuthOptions);
  return <Topbar session={session} />;
};

export default TopbarWrapper;
