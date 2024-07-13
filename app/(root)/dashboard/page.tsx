import React from "react";
import AdvancedChart from "@/components/shared/AdvanceChart";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import TickerTapeComponent from "@/components/shared/TickerTapeComponent";
import { ButtonAsset } from "@/components/dashboard/ButtonAsset";

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
                <p className="text-sm text-gray-500">
                  User created: {createdAtFormatted}
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
    </div>
  );
}
