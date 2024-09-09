/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import TransactionTableBody from "./TransactionTableBody";
import TransactionTableHead from "./TransactionTableHead";
import SelectCryptoByDate from "./SelectCryptoByDate";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

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

const getUniqueDates = (transactions: Transaction[]): string[] => {
  const dates = transactions.map((transaction) =>
    new Date(transaction.createdAt).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  );
  return Array.from(new Set(dates));
};

const RecentTransactions: React.FC<DataTransactionProps> = ({ data }) => {
  const { user } = useUser();

  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("crypto") || ""
  );
  const [selectedDate, setSelectedDate] = useState<string>("All");
  const [filter, setFilter] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filteredTransactions = dataUserId?.filter((transaction) => {
    const matchesSearchTerm = transaction.crypto
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "default" ||
      (filter === "profit" && transaction.sellTotal > 0) ||
      (filter === "No profit" && transaction.sellTotal < 0);
    return matchesSearchTerm && matchesFilter;
  });

  const uniqueDates = dataUserId ? getUniqueDates(dataUserId) : [];

  // Ordenar las transacciones por fecha en orden descendente
  const sortedTransactions = filteredTransactions?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Paginación
  const itemsPerPage = 6;
  const totalPages = Math.ceil(
    (sortedTransactions?.length || 0) / itemsPerPage
  );
  const paginatedTransactions = sortedTransactions?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedGroupedTransactions = paginatedTransactions
    ? groupByDate(paginatedTransactions)
    : {};

  return (
    <div>
      <div className="overflow-x-auto px-2 pb-2">
        <div className="flex justify-between items-center px-2 p-4">
          <h2 className="text-lg font-semibold text-gray-500">
            Recent Transactions
          </h2>

          <div className="flex gap-2">
            <RadioGroup
              onValueChange={handleFilterChange}
              className="flex gap-4"
              defaultValue="default"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" />
                <Label className="text-gray-700 dark:text-gray-500" htmlFor="r1">
                  Default
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="profit" id="r2" />
                <Label className="text-green-500 dark:text-green-400" htmlFor="r2">
                  Profit
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No profit" id="r3" />
                <Label className="text-red-500 dark:text-red-400" htmlFor="r3">
                  No profit
                </Label>
              </div>
            </RadioGroup>

            <SelectCryptoByDate
              uniqueDates={uniqueDates}
              handleDateChange={handleDateChange}
            />

            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search crypto"
              className="w-[124px] rounded-xl border-gray-400"
            />
          </div>
        </div>

        <div>
        {selectedDate === "All" ? (
          Object.keys(paginatedGroupedTransactions).length > 0 ? (
            Object.keys(paginatedGroupedTransactions).map((date) => (
              <div key={date}>
                <h3 className="text-lg font-semibold mt-2 dark:text-gray-100 text-gray-500 border-t border-gray-700">
                  {date}
                </h3>
                <table className="table-auto w-full">
                  <TransactionTableHead />

                  <TransactionTableBody
                    groupedFilteredTransactions={paginatedGroupedTransactions}
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
          )
        ) : selectedDate && paginatedGroupedTransactions[selectedDate] ? (
          <div>
            <h3 className="text-lg font-semibold mt-2 dark:text-gray-100 text-gray-500 border-t border-gray-700">
              {selectedDate}
            </h3>
            <table className="table-auto w-full">
              <TransactionTableHead />

              <TransactionTableBody
                groupedFilteredTransactions={paginatedGroupedTransactions}
                value={value}
                date={selectedDate}
              />
            </table>
          </div>
        ) : (
          <div className="mx-auto aspect-square w-full max-w-[300px] flex items-center justify-center mt-4">
            <p className="text-center text-gray-500">
              No recent transactions loaded yet.
            </p>
          </div>
        )}
        </div>

        <div className="flex justify-center items-center mt-4">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ArrowBigLeft />
          </Button>
          <span className="mx-2 text-gray-500">
            {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ArrowBigRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
