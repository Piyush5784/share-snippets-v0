"use client";
import React from "react";
import { motion } from "motion/react";
import {
  Code2,
  Github,
  Linkedin,
  Twitter,
  Mail,
  ArrowUpRight,
  Heart,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const Footer: React.FC = () => {
  const footerSections: FooterSection[] = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Documentation", href: "/docs" },
        { label: "API", href: "/api" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Tutorials", href: "/tutorials" },
        { label: "Changelog", href: "/changelog" },
        { label: "Support", href: "/support" },
      ],
    },
    {
      title: "Extensions",
      links: [
        {
          label: "VS Code",
          href: "https://marketplace.visualstudio.com/items?itemName=DishantMiyani.syntax-snipp",
          external: true,
        },
        { label: "NeoVim", href: "#", external: false },
        { label: "JetBrains", href: "#", external: false },
        { label: "Sublime Text", href: "#", external: false },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Licenses", href: "/licenses" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Twitter,
      href: "https://twitter.com",
      label: "Twitter",
      hoverColor: "hover:text-blue-500 dark:hover:text-blue-400",
    },
    {
      icon: Github,
      href: "https://github.com/Dishant1804",
      label: "GitHub",
      hoverColor: "hover:text-black dark:hover:text-white",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/dishantmiyani",
      label: "LinkedIn",
      hoverColor: "hover:text-blue-700 dark:hover:text-blue-500",
    },
    {
      icon: Mail,
      href: "mailto:contact@syntaxsnipp.com",
      label: "Email",
      hoverColor: "hover:text-green-600 dark:hover:text-green-400",
    },
  ];

  return (
    <footer className="w-full bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 relative overflow-hidden transition-colors">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#eee_1px,transparent_1px),linear-gradient(to_bottom,#eee_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-100/10 via-transparent to-transparent dark:from-blue-500/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Syntax Snipp
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
                The most powerful code snippet manager for modern developers.
                Save, organize, and share your code effortlessly.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors ${social.hoverColor}`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerSections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <h3 className="text-gray-900 dark:text-white font-semibold mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-1 group"
                      >
                        <span>{link.label}</span>
                        {link.external && (
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-gray-800" />

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Syntax Snipp. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>by Piyush</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
