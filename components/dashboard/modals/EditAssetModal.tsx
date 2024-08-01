import React from 'react'

interface DeleteAssetModalProps {
  transaction: Transaction;
}

const EditAssetModal: React.FC<DeleteAssetModalProps> = ({ transaction }) => {
  return (
    <div>
      <h1>Edit Asset Modal</h1>
      {
        transaction && (
          <div>
            <h1>{transaction.id}</h1>
            <h1>{transaction.crypto}</h1>
            <h1>{transaction.amount}</h1>
            <h1>{transaction.createdAt}</h1>
          </div>
        )
      }
    </div>
  )
}

export default EditAssetModal