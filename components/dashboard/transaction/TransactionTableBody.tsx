import React from "react";
import Image from "next/image";
import { CircleDollarSignIcon, Edit } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../ui/hover-card";
import DeleteAssetModal from "../modals/DeleteAssetModal";
import SellAssetModal from "../modals/SellAssetModal";
import EditAssetModal from "../modals/EditAssetModal";
import { Button } from "@/components/ui/button";
import Transaction from "../Transaction";


interface TransactionTableBodyProps {
  groupedFilteredTransactions: { [key: string]: Transaction[] };
  value: { [key: string]: number };
  date: string;
}

const TransactionTableBody: React.FC<TransactionTableBodyProps> = ({
  groupedFilteredTransactions,
  value,
  date,
}) => {
  return (
    <tbody className="">
      {groupedFilteredTransactions[date].map((transaction: Transaction) => {
        const result = value[transaction.crypto]
          ? value[transaction.crypto] * transaction.amount -
            transaction.price * transaction.amount
          : 0;

        const sellResult = transaction.sellTotal;

        return (
          <tr key={transaction.id} className="">
            <td>
              <div className="flex justify-start mx-auto gap-1 py-2">
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
  );
};

export default TransactionTableBody;
