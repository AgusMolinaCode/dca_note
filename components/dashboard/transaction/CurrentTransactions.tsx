"use client";

import React from "react";
import { loadTransactions } from "@/app/api";
import { useQuery } from "@tanstack/react-query";
import DataTransaction from "./DataTransaction";
import RecentTransactions from "./RecentTransactions";

const CurrentTransactions = () => {
  const { data } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="dark:bg-gray-800 bg-white shadow-md border dark:border-none border-gray-200 rounded-b-xl">
        <DataTransaction data={data} />
      </div>
      <div className="dark:bg-gray-800 bg-white shadow-md border dark:border-none border-gray-200 rounded-xl mb-10">
        <RecentTransactions data={data} />
      </div>
     
    </div>
  );
};

export default CurrentTransactions;
