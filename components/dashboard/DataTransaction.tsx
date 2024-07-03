import React from "react";
import Transaction from "./Transaction";

type DataTransactionProps = {
  data: Transaction[] | undefined;
};

const DataTransaction: React.FC<DataTransactionProps> = ({ data }) => {
  return (
    <>
      {data?.map((transaction: Transaction) => (
        <Transaction key={transaction.id} transaction={transaction} />
      ))}
    </>
  );
};

export default DataTransaction;
