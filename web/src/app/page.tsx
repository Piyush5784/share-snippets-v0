"use client";
import SmoothScrollWrapper from "@/components/custom/SmoothScrollWrapper";
import FeaturesSection from "@/components/home/FeaturesSection";
import Footer from "@/components/home/Footer";
import HeroSection from "@/components/home/HeroSection";
import Topbar from "@/components/home/Topbar";
import TryNow from "@/components/home/TryNow";
import VideoElement from "@/components/home/VideoElement";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();

  return (
    <>
      <div>
        <SmoothScrollWrapper />

        <Topbar />
        <HeroSection />
        <VideoElement />
        <FeaturesSection />
        <TryNow />
        <Footer />
      </div>
    </>
  );
}
