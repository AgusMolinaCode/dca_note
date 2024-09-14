import React from "react";
import AdvancedChart from "@/components/shared/AdvanceChart";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import TickerTapeComponent from "@/components/shared/TickerTapeComponent";
import { ButtonAsset } from "@/components/dashboard/balance/ButtonAsset";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

export default async function Page() {
  const user = await currentUser();

  const createdAtFormatted = user?.createdAt
    ? new Date(
        parseInt(user.createdAt as unknown as string)
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div>
      <div className=" w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative min-h-screen">
        <div className="absolute dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

        <div className="relative z-20">
          <div className="pt-[4.5rem]">
            <TickerTapeComponent />
            <div className="flex items-center justify-between gap-2 my-4 px-2 md:px-20">
              <div className="flex gap-1 md:gap-3 items-center">
                <Image
                  src={user?.imageUrl || "/images/user.jpg"}
                  alt="user image"
                  width={60}
                  height={60}
                  className="rounded-full w-10 h-10 "
                />
                <div>
                  <h1 className="text-xl md:text-2xl">{user?.fullName}</h1>
                  <p className="text-xs md:text-sm text-gray-500">
                    Created at: {createdAtFormatted}
                  </p>
                </div>
              </div>
              <div>
                <ButtonAsset />
              </div>
            </div>
            <AdvancedChart />
          </div>
        </div>
        <footer className="w-full p-4 ">
          <div className="border-t border-t-gray-700 px-[2rem] lg:px-[10rem]">
            <div className="grid gap-3 md:flex justify-between items-center pt-[2rem]">
              <div>
                <p className="text-gray-500 text-sm">
                  © {new Date().getFullYear()} Crypto DCA. All rights reserved.
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Developed by Agustin Molina</p>
              </div>
              <div className="flex gap-4">
                <Link
                  href="https://www.linkedin.com/in/agustin-molina-994635138/"
                  target="_blank"
                >
                  <Linkedin
                    size={20}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-500 duration-200"
                  />
                </Link>
                <Link href="https://github.com/AgusMolinaCode" target="_blank">
                  <Github
                    size={20}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-500 duration-200"
                  />
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
