import React from "react";

const TransactionTableHead = () => {
  return (
    <thead className="dark:bg-gray-800 bg-white border-b border-gray-700">
      <tr className="text-left">
        <th className="px-1 md:px-4 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-500 w-[8rem]">Name</th>
        <th className="px-1 md:px-4 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-500 w-[8rem]">Amount</th>
        <th className="px-1 md:px-4 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-500 w-[8rem]">Price</th>
        <th className="px-1 md:px-4 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-500 w-[8rem]">
          Current Price
        </th>
        <th className="px-1 md:px-4 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-500 w-[8rem]">Gain/Loss</th>
        <th className="px-1 md:px-4 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-500 text-center w-[8rem]">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default TransactionTableHead;
