import React from 'react';

type DataTransactionProps = {
  data: Transaction[] | undefined;
};

const DataTransaction: React.FC<DataTransactionProps> = ({ data }) => {
  return (
    <>
      {data?.map((transaction: Transaction) => (
        <div
          key={transaction.id}
          className="flex flex-col p-2 m-2 border gap-4"
        >
          <p>{transaction.crypto}</p>
          <p>amount: {transaction.amount}</p>
          <p>precio: {transaction.price}</p>
        </div>
      ))}
    </>
  );
};

export default DataTransaction;