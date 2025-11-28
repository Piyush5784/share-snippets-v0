"use client";
import React from "react";
import { motion } from "motion/react";
import { Sparkles, Zap, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { BackgroundBeamsWithCollision } from "../ui/background-beams-with-collision";

const TryNow = () => {
  return (
    <section className="w-full py-16 px-4 flex justify-center items-center bg-white dark:bg-black transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative w-full border-2 border-blue-500/10 dark:border-blue-500/30 backdrop-blur-sm justify-center items-center flex flex-col gap-6 max-w-6xl rounded-3xl overflow-hidden bg-white/80 dark:bg-black/80 transition-colors"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/10 via-transparent to-blue-400/10 dark:from-blue-500/5 dark:to-blue-600/5 animate-pulse" />

        <BackgroundBeamsWithCollision className="h-screen">
          <div className="flex items-center justify-center flex-col bg-none">
            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-300 dark:bg-blue-400 rounded-full"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: 0.2,
                }}
                animate={{
                  y: [null, Math.random() * 100 + "%"],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}

            {/* Beta Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <div className="group relative inline-flex md:h-11 items-center justify-center gap-2 overflow-hidden rounded-full border-2 border-blue-400/20 dark:border-blue-500/30 bg-gradient-to-r from-blue-200/10 to-blue-400/10 dark:from-blue-500/10 dark:to-blue-600/10 px-8 py-2 font-medium text-blue-900 dark:text-white transition-all hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20 h-7 w-[270px]  ">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-blue-400/20 to-blue-300/20 dark:from-blue-500/20 dark:to-blue-500/20"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <Sparkles className="w-4 h-4 relative z-10 text-blue-700 dark:text-blue-400" />
                <span className="relative z-10">Beta Version Available</span>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex flex-col w-full justify-center items-center gap-6 relative z-10">
              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col w-full gap-4 justify-center items-center"
              >
                <h1 className="text-4xl text-center md:text-6xl font-bold text-blue-900 dark:text-white leading-tight">
                  Code at{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      lightning speed
                    </span>
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    />
                  </span>
                </h1>
                <p className="text-lg text-center text-gray-500 dark:text-gray-400 max-w-xl">
                  Join thousands of developers who trust Syntax Snipp for their
                  code management
                </p>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-4 items-center"
              >
                <h4 className="text-xl md:text-2xl font-medium pt-2 max-w-3xl text-center text-gray-700 dark:text-gray-300">
                  Save, share, and manage your code snippets with powerful
                  features designed for modern developers
                </h4>

                {/* Feature badges */}
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {[
                    { icon: Zap, text: "Instant Search" },
                    { icon: Sparkles, text: "Smart Tags" },
                    { icon: ArrowRight, text: "Quick Share" },
                  ].map((feature, idx) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-black/50"
                    >
                      <feature.icon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 pt-6"
              >
                {/* Primary CTA */}
                <Button
                  className="z-50 px-8 py-6 shadow-[0px_0px_87px_8px_#2934FF] hover:shadow-[0px_0px_80px_15px_#2934FF]
                    bg-[#2934FF] text-white hover:bg-[#142876] 
                    transition-all duration-300 text-base md:text-lg hover:scale-105 font-semibold
                    group relative overflow-hidden"
                  style={{ border: "2px solid blue" }}
                  asChild
                >
                  <Link
                    href="/pages/snippets"
                    className="flex items-center gap-2"
                  >
                    <span>Create Your First Snippet</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </Button>

                {/* Secondary CTA */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-transparent px-8 py-3 font-semibold text-blue-900 dark:text-white transition-all hover:border-gray-400 dark:hover:border-gray-600 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <Link
                    target="_blank"
                    href={
                      "https://res.cloudinary.com/dzf9kamfw/video/upload/v1764288807/Screencast_from_2025-11-28_05-32-32_pc5hdd.webm"
                    }
                  >
                    View Demo
                  </Link>
                </motion.button>
              </motion.div>

              {/* Trust indicator */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="text-sm text-gray-400 dark:text-gray-500 pt-4"
              >
                ✨ No credit card required · 100% free forever
              </motion.p>
            </div>
          </div>
        </BackgroundBeamsWithCollision>
      </motion.div>
    </section>
  );
};

export default TryNow;
