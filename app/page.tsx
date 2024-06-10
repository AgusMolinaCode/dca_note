import Calculator from "@/components/shared/Calculator";
import { Hero } from "@/components/shared/Hero";
import InfoSection from "@/components/shared/InfoSection";
import Navbar from "@/components/shared/Navbar";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative z-20">
          <Navbar />
          <Hero />
          <InfoSection />
          <div>
            <Calculator />
          </div>
        </div>
      </div>
    </div>
  );
}
