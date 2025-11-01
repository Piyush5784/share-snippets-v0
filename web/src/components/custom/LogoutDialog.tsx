"use client";
import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut, X } from "lucide-react";
import { signOut } from "next-auth/react";
function LogoutDialog() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Button
          variant="ghost"
          className="text-lg -ml-3"
          // className={
          //   "relative z-10 h-8 w-8 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          // }
        > */}
        <div className="text-lg p-1 pl-2  peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md text-left  outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 cursor-pointer">
          <LogOut size={18} />
          Logout
        </div>
        {/* </Button> */}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Snippet</DialogTitle>
          <DialogDescription>
            Are you sure you want to Logout?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={handleLogout}
              className=""
              variant=""
            >
              Logout
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
        <DialogClose asChild>
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default LogoutDialog;
