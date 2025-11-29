"use client";
import { ArrowDown, Sparkles, Zap, Code2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Spotlight } from "../ui/spotlight";

const HeroSection = () => {
  const [activeM, setActiveM] = useState<string | null>(null);

  return (
    <>
      <motion.div onMouseOver={() => setActiveM(null)}>
        <div className="relative flex md:h-[60rem] h-screen text-center w-full overflow-hidden rounded-md bg-white/[0.96] dark:bg-black/[0.96] antialiased md:items-center md:justify-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb2e_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb2e_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:15px_25px]"></div>

          <Spotlight
            className="-top-40 left-0 md:-top-20 md:left-[30rem]"
            fill="white"
          />
          <Spotlight
            className="-top-40 left-0 md:-top-20 hidden md:block"
            fill="white"
          />

          {/* Floating decorative elements */}
          <motion.div
            className="absolute top-20 flex items-center justify-center p-1 left-10 md:left-20 w-18 h-18 bg-blue-400/10 dark:bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-400/20 dark:border-blue-500/20"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {"<App />"}
          </motion.div>

          <motion.div
            className="absolute top-40  right-10 md:right-28 flex items-center justify-center w-22 h-22 bg-purple-400/10 dark:bg-purple-500/10 backdrop-blur-sm rounded-lg border border-purple-400/20 dark:border-purple-500/20"
            animate={{
              y: [0, 20, 0],
              rotate: [0, -6, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            {"<Mobile />"}
          </motion.div>

          {/* Bottom left decorative element */}
          <motion.div
            className="absolute  left-10 md:left-32 flex items-center justify-center w-18 h-18 bg-green-400/10 dark:bg-green-500/10 backdrop-blur-sm rounded-lg border border-green-400/20 dark:border-green-500/20"
            animate={{
              y: [0, 15, 0],
              rotate: [0, 8, 0],
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            {"<Mdx />"}
          </motion.div>

          {/* Bottom right decorative element */}
          <motion.div
            className="absolute bottom-56 right-10 md:right-36 flex items-center justify-center w-20 h-20 bg-yellow-400/10 dark:bg-yellow-500/10 backdrop-blur-sm rounded-lg border border-yellow-400/20 dark:border-yellow-500/20"
            animate={{
              y: [0, -12, 0],
              rotate: [0, -7, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
          >
            {"<Sync />"}
          </motion.div>

          <motion.div
            className="absolute bottom-32 left-1/4 w-12 h-12 bg-cyan-400/10 dark:bg-cyan-500/10 backdrop-blur-sm rounded-lg border border-cyan-400/20 dark:border-cyan-500/20"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-40 md:pt-0">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-400/10 dark:bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 dark:border-blue-500/20 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-blue-400 dark:text-blue-500" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                VS Code Extension Available
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-opacity-50 bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-neutral-50 dark:to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-8xl"
            >
              Share Code,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 dark:from-blue-400 dark:via-blue-500 dark:to-purple-500">
                Everywhere
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-3xl text-center font-normal text-neutral-700 dark:text-neutral-300 text-lg md:text-2xl leading-relaxed"
            >
              Create, store, and access your code snippets instantly.{" "}
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Sync across devices
              </span>{" "}
              with our powerful browser extension.
            </motion.p>

            {/* Features Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3 mt-8"
            >
              {[
                { icon: Code2, text: "Browse Snippets" },
                { icon: Zap, text: "Instant Sync" },
                { icon: Sparkles, text: "Extension Access" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-100/70 dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-lg"
                >
                  <feature.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-400">
                    {feature.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center flex-col gap-8 pt-12"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="z-50 px-8 py-6 shadow-[0px_0px_87px_8px_#2934FF] hover:shadow-[0px_0px_80px_15px_#2934FF]
                    bg-[#2934FF] text-white hover:bg-[#142876] 
                    transition-all duration-300 text-base md:text-lg hover:scale-105 font-semibold
                    group relative overflow-hidden
                    dark:bg-[#2934FF] dark:text-white dark:hover:bg-[#142876]
                    border-2 border-blue-600 dark:border-blue-600"
                  asChild
                >
                  <Link href="/pages/login" className="flex items-center gap-2">
                    <span>Create Your First Snippet</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="z-50 px-8 py-6 bg-transparent border-2 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:border-neutral-600 dark:hover:border-neutral-600 transition-all duration-300 text-base md:text-lg font-semibold"
                  asChild
                >
                  <Link href="/pages/login">Explore Snippets</Link>
                </Button>
              </div>

              <motion.p
                className="text-neutral-700 dark:text-neutral-400 px-4 max-w-[600px] text-sm md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Join thousands of developers sharing code.{" "}
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  Sign in with Google, GitHub, or email
                </span>{" "}
                • Get your API key • Install the extension • Access anywhere
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap items-center justify-center gap-8 text-center"
              >
                {[
                  { number: "10K+", label: "Snippets Shared" },
                  { number: "5K+", label: "Active Users" },
                  { number: "100%", label: "Free Forever" },
                ].map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stat.number}
                    </span>
                    <span className="text-xs text-neutral-700 dark:text-neutral-500">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0.5, y: 0 }}
                animate={{ opacity: 1, y: 10 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.8,
                }}
                className="mt-4"
              >
                <ArrowDown className="text-neutral-700 dark:text-neutral-500" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default HeroSection;
