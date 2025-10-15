import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="h-[90vh] w-[100%] flex items-center justify-center flex-col">
      <Loader2 className="animate-spin" size={50}></Loader2>
      Loading...
    </div>
  );
};

export default Loader;
