import React from "react";
import Image from "next/image";

const DataTransactionTable = ({
  groupedTransactionsArray,
  value,
  averagePricesResult,
  profitValue,
  percentageValue,
  sortedGroupedTotals,
  handleRowClick,
  amount
}: {
  groupedTransactionsArray: (Transaction & { total: number })[];
  value: { [key: string]: number };
  averagePricesResult: { [key: string]: number };
  profitValue: { [key: string]: number };
  percentageValue: { [key: string]: number };
  sortedGroupedTotals: { [key: string]: number };
  amount: number;
  handleRowClick: (crypto: string) => void;
}) => {
  console.log(amount);
  return (
    <div>
      {groupedTransactionsArray.length > 0 ? (
        <div className="w-full overflow-x-auto px-2 pb-2">
          <div className="flex justify-between items-center px-2 pt-4">
            <h2 className="text-lg font-semibold text-gray-500">Assets</h2>
          </div>
          <table className="w-full table-auto">
            <thead className="dark:bg-gray-800 bg-gray-600 pb-2 border-b border-gray-600">
              <tr className="text-left">
                <th className="px-4 py-2 text-sm text-gray-400">Asset</th>
                <th className="px-4 py-2 text-sm text-gray-400">
                  Current Price
                </th>
                <th className="px-4 py-2 text-sm text-gray-400">
                  Avg. Buy Price
                </th>
                <th className="px-4 py-2 text-sm text-gray-400">
                  24Hs Price Change
                </th>
                <th className="px-4 py-2 text-sm text-gray-400">
                  24Hs % Change
                </th>
                <th className="px-4 py-2 text-sm text-gray-400">
                  Total Invested
                </th>
                <th className="px-4 py-2 text-sm text-gray-400">
                  Current Profit
                </th>
                {/* <th className="px-4 py-2 text-sm text-gray-400 text-center">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="dark:bg-gray-800 bg-gray-400">
              {groupedTransactionsArray.map((transaction: any) => (
                <tr
                  key={transaction.id}
                  className="border-t border-gray-600 hover:bg-gray-700 cursor-pointer duration-300"
                  onClick={() => handleRowClick(transaction.crypto)}
                >
                  <td className="flex gap-1 items-center my-2">
                    <Image
                      src={`https://cryptocompare.com/${transaction.imageUrl}`}
                      alt={transaction.crypto}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <p className="px-4 py-2 text-md font-semibold">
                      {transaction.crypto}
                    </p>
                  </td>
                  <td className={`px-4 py-2 font-semibold`}>
                    {value?.[transaction.crypto] !== undefined
                      ? `$ ${value[transaction.crypto].toFixed(2)}`
                      : "$ 0.00"}
                  </td>
                  <td
                    className={`px-4 py-2 font-semibold  ${
                      (value?.[transaction.crypto] ?? 0) <
                      (averagePricesResult?.[transaction.crypto] ?? 0)
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    ${" "}
                    {averagePricesResult?.[transaction.crypto]?.toFixed(2) ??
                      "0.00"}
                  </td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      profitValue?.[transaction.crypto] !== undefined &&
                      profitValue?.[transaction.crypto] < 0
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    ${" "}
                    {profitValue?.[transaction.crypto] !== undefined
                      ? profitValue[transaction.crypto].toFixed(2)
                      : "0.00"}
                  </td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      percentageValue?.[transaction.crypto] !== undefined &&
                      percentageValue?.[transaction.crypto] < 0
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {percentageValue?.[transaction.crypto] !== undefined
                      ? percentageValue[transaction.crypto].toFixed(2)
                      : "0.00"}{" "}
                    %
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    ${" "}
                    {sortedGroupedTotals?.[transaction.crypto]?.toFixed(2) ??
                      "0.00"}
                  </td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      (value?.[transaction.crypto] ?? 0) -
                        (averagePricesResult?.[transaction.crypto] ?? 0) <
                      0
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    ${" "}
                    {((amount * value?.[transaction.crypto]) -
                      sortedGroupedTotals?.[transaction.crypto]).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mx-auto aspect-square w-full max-w-[300px] flex items-center justify-center mt-4">
          <p className="text-center text-gray-500">
            No current transactions loaded yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default DataTransactionTable;
