"use client";

import * as React from "react";
import {
  AudioWaveform,
  BellIcon,
  BellRingIcon,
  BookOpen,
  Bot,
  Code,
  Command,
  ExternalLink,
  Frame,
  GalleryVerticalEnd,
  icons,
  Map,
  Pencil,
  PieChart,
  Settings2,
  Share,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

// This is sample data.
const data = {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  teams: [
    {
      name: "Share Snippets",
      logo: Code,
      // plan: "Enterprise",
    },
    // {
    //   name: "Acme Corp.",
    //   logo: AudioWaveform,
    //   plan: "Startup",
    // },
    // {
    //   name: "Evil Corp.",
    //   logo: Command,
    //   plan: "Free",
    // },
  ],
  navMain: [
    {
      title: "Snippets",
      url: "/pages/snippets",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "All Snippets",
          icon: Pencil,
          url: "/pages/snippets/All",
        },
        {
          title: "My Snippets",
          icon: Pencil,
          url: "/pages/snippets/my",
        },
        {
          title: "Starred",
          icon: Pencil,
          url: "/pages/snippets/starred",
        },
      ],
    },
    {
      title: "Create",
      url: "/pages/snippets/create",
      icon: Bot,
      // items: [
      //   {
      //     title: "Genesis",
      //     url: "#",
      //   },
      //   {
      //     title: "Explorer",
      //     url: "#",
      //   },
      //   {
      //     title: "Quantum",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "How to use?",
      url: "/pages/snippets/documentation",
      icon: BookOpen,
      // items: [
      //   {
      //     title: "Introduction",
      //     url: "#",
      //   },
      //   {
      //     title: "Get Started",
      //     url: "#",
      //   },
      //   {
      //     title: "Tutorials",
      //     url: "#",
      //   },
      //   {
      //     title: "Changelog",
      //     url: "#",
      //   },
      // ],
    },
    // {
    //   title: "Notification",
    //   url: "/pages/snippets/notification",
    //   icon: BellIcon,
    // },
    {
      title: "Settings",
      url: "/pages/snippets/settings",
      icon: Settings2,
      // items: [
      //   {
      //     title: "General",
      //     url: "#",
      //   },
      //   {
      //     title: "Team",
      //     url: "#",
      //   },
      //   {
      //     title: "Billing",
      //     url: "#",
      //   },
      //   {
      //     title: "Limits",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Logout",
      url: "#",
      icon: ExternalLink,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  const name = session.data?.user?.name || "";
  const email = session.data?.user?.email || "";
  const image = session.data?.user?.image || "";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ avatar: image, email: email, name: name }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
