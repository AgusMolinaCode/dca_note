import Footer from "@/components/shared/Footer";
import { Hero } from "@/components/shared/Hero";
import InfoSection from "@/components/shared/InfoSection";


export default function Home() {
  return (
    <div>
      <div className=" w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative z-20 ">
          <Hero />
          <InfoSection />
          <p className="dark:text-stone-900/50 text-stone-200/50 text-center font-bold text-[7rem] md:text-[10rem] lg:text-[22rem] z-30 mb-10 lg:mb-0">
            HODL 
          </p>
          <div className="flex justify-center items-center mx-auto">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
