"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { ThemeButton } from "../theme-toggle";
import Link from "next/link";
import { useSession } from "next-auth/react";

const navItems = [
  { name: "Features", link: "#features" },
  { name: "Pricing", link: "#pricing" },
  { name: "Contact", link: "#contact" },
];

const Topbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { status } = useSession();

  return (
    <div className="fixed top-0 w-full z-50">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems className="text-xl" items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">
              <ThemeButton />
            </NavbarButton>
            {status == "authenticated" ? (
              <NavbarButton href="/pages/snippets" variant="primary">
                Dashboard
              </NavbarButton>
            ) : (
              <NavbarButton href="/pages/login" variant="primary">
                Login
              </NavbarButton>
            )}
            {/* <NavbarButton variant="primary">Book a call</NavbarButton> */}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
};

export default Topbar;
