import React from "react";
import Image from "next/image";
import { TokenUSDT } from "@token-icons/react";

const DataTransactionTable = ({
  groupedTransactionsArray,
  value,
  averagePricesResult,
  profitValue,
  percentageValue,
  handleRowClick,
  groupedAmounts,
}: {
  groupedTransactionsArray: (Transaction & { total: number })[];
  value: { [key: string]: number };
  averagePricesResult: {
    [key: string]: { total: number; count: number; average: number };
  };
  profitValue: { [key: string]: number };
  percentageValue: { [key: string]: number };
  sortedGroupedTotals: { [key: string]: number };
  groupedAmounts: { [key: string]: number };
  handleRowClick: (crypto: string) => void;
}) => {
  return (
    <div>
      {groupedTransactionsArray.length > 0 ? (
        <div className="w-full overflow-x-auto px-2 pb-2">
          <div className="flex justify-between items-center px-2 pt-4">
            <h2 className="text-lg font-semibold text-gray-500">Assets</h2>
          </div>
          <table className="w-full table-auto">
            <thead className="dark:bg-gray-800 bg-white pb-2 border-b border-gray-600">
              <tr className="text-left">
                <th className="px-4 py-2 text-sm text-gray-700 dark:text-gray-500">Asset</th>
                <th className="px-4 py-2 text-sm text-gray-700 dark:text-gray-500">
                  Current Price
                </th>
                <th className="px-4 py-2 text-sm text-gray-700 dark:text-gray-500">Amount</th>
                <th className="px-4 py-2 text-sm text-gray-700 dark:text-gray-500">
                  Avg. Buy Price
                </th>
                <th className="px-4 py-2 text-sm text-gray-700 dark:text-gray-500">
                  24Hs Price Change
                </th>
                <th className="px-4 py-2 text-sm text-gray-700 dark:text-gray-500">
                  24Hs % Change
                </th>
                <th className="px-4 py-2 text-sm text-gray-700 dark:text-gray-500">
                  Total Invested
                </th>
                <th className="px-4 py-2 text-sm text-gray-700 dark:text-gray-500">
                  Avg .Gain/Loss
                </th>
              </tr>
            </thead>
            <tbody className="dark:bg-gray-800">
              {groupedTransactionsArray.map((transaction: any) => {
                const amount = groupedAmounts[transaction.crypto];
                const currentValue = value?.[transaction.crypto];
                const currentProfit = amount * currentValue;

                const currentTotal =
                  amount *
                  (Number.isFinite(
                    averagePricesResult?.[transaction.crypto]?.average
                  )
                    ? averagePricesResult[transaction.crypto].average
                    : transaction.price);

                const finalProfit = currentProfit - currentTotal;

                const totalInvested =
                  amount *
                  (Number.isFinite(
                    averagePricesResult[transaction.crypto]?.average
                  )
                    ? averagePricesResult[transaction.crypto].average
                    : transaction.price);

                if (amount <= 0 || amount === undefined || isNaN(amount)) {
                  return null;
                }

                return (
                  <tr
                    key={transaction.id}
                    className="border-t border-gray-600 dark:hover:bg-gray-700 hover:bg-gray-100 cursor-pointer duration-300"
                    onClick={() => handleRowClick(transaction.crypto)}
                  >
                    <td className="flex gap-1 justify-center items-center py-4">
                      {transaction.imageUrl ? (
                        <Image
                          src={`https://cryptocompare.com/${transaction.imageUrl}`}
                          alt={transaction.crypto}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <TokenUSDT className="w-6 h-6" variant="branded" />
                      )}
                      <p className="px-4 py-2 text-md font-semibold">
                        {transaction.crypto}
                      </p>
                    </td>
                    <td className={`px-4 py-2 font-semibold`}>
                      {currentValue !== undefined
                        ? `$ ${currentValue.toFixed(2)}`
                        : "$ 0.00"}
                    </td>
                    <td className="px-4 py-2 font-semibold">
                      {amount?.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        (currentValue ?? 0) <
                        (Number.isFinite(
                          averagePricesResult?.[transaction.crypto]?.average
                        )
                          ? averagePricesResult[transaction.crypto].average
                          : transaction.price)
                          ? "text-red-500 dark:text-red-400"
                          : "text-green-500 dark:text-green-400"
                      }`}
                    >
                      ${" "}
                      {(Number.isFinite(
                        Number(
                          averagePricesResult?.[transaction.crypto]?.average
                        )
                      )
                        ? Number(
                            averagePricesResult[transaction.crypto].average
                          )
                        : Number(transaction.price)
                      ).toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        profitValue?.[transaction.crypto] !== undefined &&
                        profitValue?.[transaction.crypto] < 0
                          ? "text-red-500 dark:text-red-400"
                          : "text-green-500 dark:text-green-400"
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
                          ? "text-red-500 dark:text-red-400"
                          : "text-green-500 dark:text-green-400"
                      }`}
                    >
                      {percentageValue?.[transaction.crypto] !== undefined
                        ? percentageValue[transaction.crypto].toFixed(2)
                        : "0.00"}{" "}
                      %
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        totalInvested < 0 ? "text-green-500 dark:text-green-400" : ""
                      }`}
                    >
                      $ {Math.abs(totalInvested).toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        finalProfit < 0 ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-green-400"
                      }`}
                    >
                      ${finalProfit.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
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
