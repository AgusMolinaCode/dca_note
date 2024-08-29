/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import TransactionTableBody from "./TransactionTableBody";

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

  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("crypto") || ""
  );

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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTransactions = searchTerm
    ? dataUserId?.filter((transaction) =>
        transaction.crypto.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : dataUserId;

  const groupedFilteredTransactions = filteredTransactions
    ? groupByDate(filteredTransactions)
    : {};

  const scrollAreaClassName = searchTerm ? "h-full" : "h-[56rem]";
  return (
    <div>
      <div className="overflow-x-auto px-2 pb-2">
        <div className="flex justify-between items-center px-2 p-4">
          <h2 className="text-lg font-semibold text-gray-500">
            Recent Transactions
          </h2>

          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search crypto"
            className="max-w-[12rem]"
          />
        </div>
        <ScrollArea className={scrollAreaClassName}>
          {groupedFilteredTransactions &&
          Object.keys(groupedFilteredTransactions).length > 0 ? (
            Object.keys(groupedFilteredTransactions).map((date) => (
              <div key={date} className="">
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

                  <TransactionTableBody
                    groupedFilteredTransactions={groupedFilteredTransactions}
                    value={value}
                    date={date}
                  />
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
        </ScrollArea>
      </div>
    </div>
  );
};

export default RecentTransactions;
