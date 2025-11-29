import SmoothScrollWrapper from "@/components/custom/SmoothScrollWrapper";
import FeaturesSection from "@/components/home/FeaturesSection";
import Footer from "@/components/home/Footer";
import HeroSection from "@/components/home/HeroSection";
import TopbarWrapper from "@/components/home/TopbarWrapper";
import TryNow from "@/components/home/TryNow";
import VideoElement from "@/components/home/VideoElement";

export default function Home() {
  return (
    <>
      <div>
        <SmoothScrollWrapper />

        <TopbarWrapper />
        <HeroSection />
        <VideoElement />
        <FeaturesSection />
        <TryNow />
        <Footer />
      </div>
    </>
  );
}
