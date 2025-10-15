"use client";
import {
  Code2,
  Lock,
  Rocket,
  Search,
  Heart,
  User,
  FolderOpen,
  Shield,
  Terminal,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect, useMemo, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Types
interface AnimatedLine {
  width: string;
  delay: number;
  color: string;
}

interface Particle {
  key: number;
  x: number;
  y: number;
  targetY: number;
  duration: number;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  content: ReactNode;
  iconColor?: string;
  showLiveIndicator?: boolean;
}

interface AdditionalFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface LiveCounterProps {
  target: number;
  label: string;
}

interface FeatureCardProps {
  feature?: Feature;
  delay: number;
  children: ReactNode;
  className?: string;
}

interface SmallFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
  iconColor?: string;
  showLiveIndicator?: boolean;
}

interface AnimatedLineProps {
  width: string;
  delay: number;
  color: string;
}

// Constants
const CODE_SNIPPETS: readonly string[] = [
  "const hello = 'world';",
  "function greet() { }",
  "let data = [1, 2, 3];",
  "return response.json();",
] as const;

const SEARCH_TERMS: readonly string[] = [
  "react hooks",
  "python loops",
  "css grid",
  "javascript",
] as const;

const LANGUAGES: readonly string[] = [
  "JavaScript",
  "Python",
  "TypeScript",
  "Go",
  "Rust",
  "Java",
] as const;

const ANIMATED_LINES: readonly AnimatedLine[] = [
  { width: "33.33%", delay: 0, color: "bg-blue-500/30" },
  { width: "66.66%", delay: 0.2, color: "bg-blue-400/25" },
  { width: "50%", delay: 0.4, color: "bg-blue-300/15 dark:bg-white/15" },
  { width: "75%", delay: 0.6, color: "bg-blue-300/20" },
  { width: "25%", delay: 0.8, color: "bg-blue-500/25" },
] as const;

const PARTICLE_COUNT = 15;

// Utility function for cycling through arrays
const useCycleAnimation = (
  items: readonly string[],
  typingSpeed: number = 100,
  pauseTime: number = 2000
): string => {
  const [displayText, setDisplayText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    let charIndex = 0;
    const currentItem = items[currentIndex];

    const interval = setInterval(() => {
      if (charIndex < currentItem.length) {
        setDisplayText(currentItem.substring(0, charIndex + 1));
        charIndex++;
      } else {
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % items.length);
          setDisplayText("");
          charIndex = 0;
        }, pauseTime);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [currentIndex, items, typingSpeed, pauseTime]);

  return displayText;
};

// Live typing animation component
const LiveTypingCode: React.FC = () => {
  const displayedCode = useCycleAnimation(CODE_SNIPPETS, 100, 2000);

  return (
    <div className="font-mono text-sm">
      <span className="text-gray-900 dark:text-white">{displayedCode}</span>
      <span className="inline-block w-2 h-4 bg-gray-900 dark:bg-white ml-1 animate-pulse" />
    </div>
  );
};

// Live counter animation
const LiveCounter: React.FC<LiveCounterProps> = ({ target, label }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        {count.toLocaleString()}+
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {label}
      </div>
    </div>
  );
};

// Live activity indicator
const LiveActivityDot: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="relative">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
    </div>
    <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
  </div>
);

// Live search animation
const LiveSearchAnimation: React.FC = () => {
  const searchText = useCycleAnimation(SEARCH_TERMS, 150, 1500);

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md">
      <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <span className="text-sm text-gray-900 dark:text-white">
        {searchText}
      </span>
      <span className="inline-block w-0.5 h-4 bg-gray-900 dark:bg-white animate-pulse" />
    </div>
  );
};

// Live star animation
const LiveStarAnimation: React.FC = () => {
  const [isStarred, setIsStarred] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => setIsStarred((prev) => !prev), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      animate={{ scale: isStarred ? [1, 1.3, 1] : 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex"
    >
      <Heart
        className={`w-8 h-8 transition-all duration-300 ${
          isStarred
            ? "fill-blue-600 dark:fill-white text-blue-600 dark:text-white"
            : "text-gray-400 dark:text-gray-400"
        }`}
      />
    </motion.div>
  );
};

// Animated line component
const AnimatedLine: React.FC<AnimatedLineProps> = ({ width, delay, color }) => (
  <motion.div
    initial={{ width: 0, opacity: 0 }}
    animate={{ width, opacity: 1 }}
    transition={{
      duration: 0.8,
      delay,
      repeat: Infinity,
      repeatDelay: 3,
    }}
    className={`h-2 ${color} rounded`}
  />
);

// Feature card component
const FeatureCard: React.FC<FeatureCardProps> = ({
  delay,
  children,
  className = "",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// Small feature card component
const SmallFeatureCard: React.FC<SmallFeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  children,
  iconColor = "text-blue-600 dark:text-white",
  showLiveIndicator = false,
}) => (
  <Card className="h-full group shadow-2xl shadow-blue-500/10 transition-all duration-300 border-2 border-blue-200 dark:border-blue-500/30 relative overflow-hidden bg-white dark:bg-black">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    {showLiveIndicator && (
      <div className="absolute top-4 right-4 z-20">
        <LiveActivityDot />
      </div>
    )}
    <CardHeader className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-white/5 border border-blue-200 dark:border-gray-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <CardTitle className="text-xl mb-2 text-gray-900 dark:text-white">
        {title}
      </CardTitle>
      <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </CardDescription>
      {children}
    </CardHeader>
  </Card>
);

const FeaturesSection: React.FC = () => {
  const [lockToggle, setLockToggle] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => setLockToggle((prev) => !prev), 2500);
    return () => clearInterval(interval);
  }, []);

  // Memoize particle generation
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        key: i,
        x: Math.random() * 1000,
        y: Math.random() * 1000,
        targetY: Math.random() * 1000,
        duration: Math.random() * 10 + 10,
      })),
    []
  );

  const features = useMemo<Feature[]>(
    () => [
      {
        icon: Lock,
        title: "Private",
        description: "Full control over snippet visibility.",
        content: (
          <div className="mt-4 flex items-center gap-3">
            <motion.div
              animate={{
                backgroundColor: lockToggle
                  ? "rgba(59,130,246,0.1)"
                  : "rgba(229,231,235,0.5)",
              }}
              transition={{ duration: 0.3 }}
              className="relative w-12 h-6 rounded-full border border-gray-300 dark:border-gray-700"
            >
              <motion.div
                animate={{ left: lockToggle ? 24 : 2 }}
                transition={{ duration: 0.3 }}
                className={`absolute top-0.5 w-5 h-5 rounded-full ${
                  lockToggle
                    ? "bg-blue-600 dark:bg-white"
                    : "bg-gray-400 dark:bg-gray-500"
                }`}
              />
            </motion.div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {lockToggle ? "Public" : "Private"}
            </span>
          </div>
        ),
        iconColor: "text-blue-600 dark:text-blue-500",
      },
      {
        icon: Rocket,
        title: "Instant Sharing",
        description: "Share code with unique links instantly.",
        content: (
          <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-gray-700 rounded-md">
            <Terminal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <motion.div
              className="flex-1 h-2 bg-blue-600 dark:bg-blue-500 rounded"
              animate={{ width: ["0%", "100%"] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          </div>
        ),
        showLiveIndicator: true,
      },
      {
        icon: Search,
        title: "Smart Search",
        description:
          "Find snippets by language, tags, or keywords in milliseconds.",
        content: (
          <div className="mt-4">
            <LiveSearchAnimation />
          </div>
        ),
      },
      {
        icon: Heart,
        title: "Star Favorites",
        description: "Bookmark and organize your go-to snippets.",
        content: (
          <div className="mt-4 flex justify-center">
            <LiveStarAnimation />
          </div>
        ),
      },
      {
        icon: User,
        title: "User Profiles",
        description: "Showcase your work and build your developer portfolio.",
        content: (
          <div className="mt-4">
            <LiveCounter target={1200} label="Active Users" />
          </div>
        ),
      },
    ],
    [lockToggle]
  );

  const additionalFeatures: AdditionalFeature[] = [
    {
      icon: FolderOpen,
      title: "Collections & Tags",
      description: "Organize snippets with smart collections and custom tags",
    },
    {
      icon: Shield,
      title: "Secure & Encrypted",
      description: "Your code is safe with enterprise-grade encryption",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-gray-50 dark:bg-black text-gray-900 dark:text-white relative overflow-hidden"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      {/* Floating particles */}
      {particles.map(({ key, x, y, targetY, duration }) => (
        <motion.div
          key={key}
          className="absolute w-1 h-1 bg-blue-400 dark:bg-white rounded-full"
          initial={{ x, y, opacity: 0.1 }}
          animate={{ y: [null, targetY], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
        />
      ))}

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 border-blue-300 dark:border-gray-700 bg-blue-50 dark:bg-black text-blue-700 dark:text-white"
          >
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            Powerful Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Everything you need
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Built for developers who value speed, organization, and
            collaboration
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {/* Large Feature Card */}
          <FeatureCard delay={0.1} className="md:col-span-2 md:row-span-2">
            <Card className="h-full group shadow-2xl shadow-blue-500/20 transition-all duration-300 border-2 border-blue-300 dark:border-blue-500/50 relative overflow-hidden bg-white dark:bg-black">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 dark:from-blue-500/10 to-blue-50 dark:to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Code2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <LiveActivityDot />
                </div>
                <CardTitle className="text-2xl md:text-3xl mb-2 text-gray-900 dark:text-white">
                  Syntax Highlighting
                </CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                  Monaco editor support for beautiful, readable code with 100+
                  language themes.
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10">
                {/* Live Code Preview */}
                <div className="bg-gray-100 dark:bg-zinc-900/50 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4 font-mono text-sm space-y-3">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600"
                      />
                    ))}
                    <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
                      snippet.js
                    </span>
                  </div>
                  <div className="pt-2 min-h-[60px]">
                    <LiveTypingCode />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  {ANIMATED_LINES.map((line, idx) => (
                    <AnimatedLine key={idx} {...line} />
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <Badge
                      key={lang}
                      variant="outline"
                      className="text-xs border-blue-200 dark:border-gray-700 bg-blue-50 dark:bg-black text-blue-700 dark:text-gray-300"
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FeatureCard>

          {/* Small Feature Cards */}
          {features.map((feature, idx) => (
            <FeatureCard
              key={feature.title}
              delay={0.2 + idx * 0.1}
              className="md:col-span-1"
            >
              <SmallFeatureCard {...feature}>
                {feature.content}
              </SmallFeatureCard>
            </FeatureCard>
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 grid md:grid-cols-2 gap-6"
        >
          {additionalFeatures.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="h-full group shadow-2xl shadow-blue-500/10 transition-all duration-300 border-2 border-blue-200 dark:border-blue-500/30 relative overflow-hidden bg-white dark:bg-black"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-white" />
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      {title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                      {description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
