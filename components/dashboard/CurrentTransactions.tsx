"use client";

import React from "react";
import { loadTransactions } from "@/app/api";
import { useQuery } from "@tanstack/react-query";
import DataTransaction from "../dashboard/DataTransaction";

const CurrentTransactions = () => {
  const { data } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
  });

  return (
    <div>
      <div className="dark:bg-gray-800 bg-gray-600 rounded-b-xl">
        <DataTransaction data={data} />
      </div>
    </div>
  );
};

export default CurrentTransactions;
