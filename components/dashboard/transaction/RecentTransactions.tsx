/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import DeleteAssetModal from "../modals/DeleteAssetModal";
import SellAssetModal from "../modals/SellAssetModal";
import Image from "next/image";
import { CircleDollarSignIcon, Edit } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../ui/hover-card";
import EditAssetModal from "../modals/EditAssetModal";
import { Button } from "@/components/ui/button";

type DataTransactionProps = {
  data: Transaction[] | undefined;
};

const groupByDate = (
  transactions: Transaction[]
): { [key: string]: Transaction[] } => {
  if (!Array.isArray(transactions)) {
    return {};
  }

  transactions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return transactions.reduce(
    (acc: { [x: string]: Transaction[] }, transaction: Transaction) => {
      const date = new Date(transaction.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    },
    {}
  );
};

const RecentTransactions: React.FC<DataTransactionProps> = ({ data }) => {
  const { user } = useUser();

  const dataUserId = data?.filter((item) => item.userId === user?.id);

  const cryptoJoin = dataUserId?.map((item) => item.crypto).join(",");

  const [value, setValue] = useState<{ [key: string]: number }>({});

  const fetchFullCryptosData = async () => {
    if (cryptoJoin) {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoJoin}&tsyms=USD&api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`
      );
      const data: CryptoListResult = await response.json();

      const prices: { [key: string]: number } = Object.keys(data.RAW).reduce(
        (acc, crypto) => {
          acc[crypto] = data.RAW[crypto as any].USD.PRICE;
          return acc;
        },
        {} as { [key: string]: number }
      );

      setValue(prices);
    }
  };

  useEffect(() => {
    fetchFullCryptosData();
  }, [cryptoJoin]);

  const groupedTransactions = dataUserId ? groupByDate(dataUserId) : {};

  return (
    <div>
      <div className="overflow-x-auto px-2 pb-2">
        <div className="flex justify-between items-center px-2 p-4">
          <h2 className="text-lg font-semibold text-gray-500">
            Recent Transactions
          </h2>
          <button className="group rounded-xl relative inline-flex h-8 items-center justify-center overflow-hidden bg-gradient-to-r from-indigo-500 to-indigo-700 px-2 md:px-4 font-medium text-neutral-200 transition hover:scale-110">
            <span>Sell Transactions</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
              <div className="relative h-full w-8 bg-white/20"></div>
            </div>
          </button>
        </div>

        {groupedTransactions && Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions).map((date) => (
            <div key={date}>
              <h3 className="text-lg font-semibold mt-2 text-gray-100 border-t border-gray-700">
                {date}
              </h3>
              <table className="table-auto w-full">
                <thead className="dark:bg-gray-800 bg-gray-600 border-b border-gray-700">
                  <tr className="text-left">
                    <th className="px-4 py-2 text-sm text-gray-400 w-[8rem]">
                      Name
                    </th>
                    <th className="px-4 py-2 text-sm text-gray-400 w-[8rem]">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-sm text-gray-400 w-[8rem]">
                      Price
                    </th>
                    <th className="px-4 py-2 text-sm text-gray-400 w-[8rem]">
                      Current Price
                    </th>
                    <th className="px-4 py-2 text-sm text-gray-400 w-[8rem]">
                      Gain/Loss
                    </th>
                    <th className="px-4 py-2 text-sm text-gray-400 text-center w-[8rem]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="">
                  {groupedTransactions[date].map((transaction: Transaction) => {
                    const result = value[transaction.crypto]
                      ? value[transaction.crypto] * transaction.amount -
                        transaction.price * transaction.amount
                      : 0;

                    const sellResult = transaction.sellTotal;

                    return (
                      <tr key={transaction.id} className="">
                        <td>
                          <div className="flex justify-center mx-auto gap-1 py-2">
                            <div className="relative">
                              {transaction.imageUrl === "/images/usdt.png" ? (
                                <Image
                                  src={transaction.imageUrl}
                                  alt={`${transaction.crypto} sell`}
                                  width={32}
                                  height={32}
                                  className="rounded-full bg-zinc-900"
                                />
                              ) : (
                                <Image
                                  src={`https://cryptocompare.com/${transaction.imageUrl}`}
                                  alt={transaction.crypto}
                                  width={32}
                                  height={32}
                                  className="rounded-full bg-zinc-900 p-[3px]"
                                />
                              )}
                              <CircleDollarSignIcon
                                size={24}
                                className="text-green-400 bg-zinc-900 rounded-full  absolute bottom-[-11px] left-3 p-[3px]"
                              />
                            </div>
                            <p className="px-4 py-2 text-md font-semibold text-gray-200">
                              {transaction.crypto}
                            </p>
                            {transaction.imageUrl === "/images/usdt.png" ? (
                              <p className="bg-red-500/10 border-[0.2px] border-red-500 text-red-300 px-2 my-auto text-xs rounded-xl">
                                sell
                              </p>
                            ) : (
                              <p className="bg-green-500/10 border-[0.2px] border-green-500 text-green-300 px-2 my-auto text-xs rounded-xl">
                                buy
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 font-semibold w-[8rem]">
                          {transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 font-semibold w-[8rem]">
                          <div className="flex gap-2 items-center justify-start">
                            <p>${transaction.price.toFixed(2)}</p>
                            <p>
                              {transaction.imageUrl === "/images/usdt.png" ? (
                                <span className="text-gray-300 text-[0.60rem] bg-green-400/20 py-[0.15rem] px-2 rounded-xl">
                                  Sell Price
                                </span>
                              ) : (
                                <span className="text-gray-300 text-[0.60rem] bg-green-400/20 py-[0.15rem] px-2 rounded-xl">
                                  Buy Price
                                </span>
                              )}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-2 font-semibold w-[8rem]">
                          <div className="flex gap-2 items-center justify-start">
                            <p>${value[transaction.crypto]?.toFixed(2)}</p>
                            {/* <p>
                              {transaction.imageUrl === "/images/usdt.png" && (
                                <span className="text-gray-300 text-[0.60rem] bg-green-400/20 py-[0.15rem] px-2 rounded-xl">
                                  Buy Price
                                </span>
                              )}
                            </p> */}
                          </div>
                        </td>
                        <td
                          className={`px-4 py-2 font-semibold w-[8rem] ${
                            transaction.imageUrl === "/images/usdt.png"
                              ? sellResult > 0
                                ? "text-green-400"
                                : "text-red-400"
                              : result > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          <div className="flex gap-2 items-center justify-start">
                            <p>
                              {transaction.imageUrl === "/images/usdt.png"
                                ? sellResult.toFixed(2)
                                : result.toFixed(2)}
                            </p>
                            <p>
                              {transaction.imageUrl === "/images/usdt.png" &&
                                (sellResult > 0 ? (
                                  <span className="text-gray-300 text-[0.60rem] bg-green-400/20 py-[0.15rem] px-2 rounded-xl">
                                    Profit
                                  </span>
                                ) : (
                                  <span className="text-gray-300 text-[0.60rem] bg-red-400/20 py-[0.15rem] px-2 rounded-xl">
                                    No Profit
                                  </span>
                                ))}
                            </p>
                          </div>
                        </td>
                        <td className="flex items-center justify-end mx-auto w-[8rem] gap-1 py-2">
                          <HoverCard closeDelay={10} openDelay={10}>
                            <HoverCardTrigger>
                              <SellAssetModal
                                transaction={transaction}
                                criptoPrice={value[transaction.crypto]}
                                amount={transaction.amount}
                                result={result}
                              />
                            </HoverCardTrigger>
                          </HoverCard>
                          <HoverCard closeDelay={10} openDelay={10}>
                            <HoverCardTrigger>
                              <DeleteAssetModal transaction={transaction} />
                            </HoverCardTrigger>
                            <HoverCardContent className="w-34 text-center text-gray-400 text-sm">
                              Delete transaction
                            </HoverCardContent>
                          </HoverCard>
                          {transaction.imageUrl === "/images/usdt.png" ? (
                            <Button disabled className="px-1">
                              <Edit size={24} />
                            </Button>
                          ) : (
                            <HoverCard closeDelay={10} openDelay={10}>
                              <HoverCardTrigger>
                                <EditAssetModal transaction={transaction} />
                              </HoverCardTrigger>
                              <HoverCardContent className="w-34 text-center text-gray-400 text-sm">
                                Edit transaction
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <div className="mx-auto aspect-square w-full max-w-[300px] flex items-center justify-center mt-4">
            <p className="text-center text-gray-500">
              No recent transactions loaded yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
