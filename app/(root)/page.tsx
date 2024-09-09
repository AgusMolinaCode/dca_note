import { Hero } from "@/components/shared/Hero";
import InfoSection from "@/components/shared/InfoSection";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className=" w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

        <Hero />
        <InfoSection />

        {/* <Footer /> */}
        <div className="h-[30rem] hidden md:flex items-center justify-center">
          <TextHoverEffect text="HODL" />
        </div>
        <div className="flex justify-center gap-4 pb-5 mt-8 md:mt-0 md:pb-10">
          <Link
            href="https://www.linkedin.com/in/agustin-molina-994635138/"
            target="_blank"
          >
            <Linkedin
              size={32}
              className="text-neutral-600 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-500 duration-200"
            />
          </Link>
          <Link href="https://github.com/AgusMolinaCode" target="_blank">
            <Github
              size={32}
              className="text-neutral-600 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-500 duration-200"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
