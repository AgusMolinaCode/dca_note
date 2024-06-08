import { Hero } from "@/components/shared/Hero";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="h-full w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative z-20">
          <Navbar />
          <Hero />
        </div>
      </div>
    </div>
  );
}
