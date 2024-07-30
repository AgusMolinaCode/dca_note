"use client";

import React from "react";
import { loadTransactions } from "@/app/api";
import { useQuery } from "@tanstack/react-query";
import DataTransaction from "../dashboard/DataTransaction";
import RecentTransactions from "./RecentTransactions";

const CurrentTransactions = () => {
  const { data } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="dark:bg-gray-800 bg-gray-600 rounded-b-xl">
        <DataTransaction data={data} />
      </div>
      <div className="dark:bg-gray-800 bg-gray-600 rounded-xl">
        <RecentTransactions data={data}/>
      </div>
    </div>
  );
};

export default CurrentTransactions;
