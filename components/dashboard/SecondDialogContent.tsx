import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface SecondDialogContentProps {
  selectedCrypto: { crypto: string; price: number; imageUrl: string } | null;
  onAddTransaction: () => void; // Agregar esta línea
}

const SecondDialogContent: React.FC<SecondDialogContentProps> = ({
  selectedCrypto,
  onAddTransaction,
}) => {
  const [amount, setAmount] = useState<number>(1);
  const [criptoPrice, setCryptoPrice] = useState<number>(0); // Agregar esta línea
  const [totalPrice, setTotalPrice] = useState<string>("0.00");

  useEffect(() => {
    if (selectedCrypto) {
      setCryptoPrice(selectedCrypto.price); // Agregar esta línea
      setTotalPrice((selectedCrypto.price * amount).toFixed(2));
    }
  }, [selectedCrypto, amount]);

  return (
    <div>
      <div>
        <div className="flex gap-2 justify-start items-center">
          <Image
            src={`https://cryptocompare.com/${selectedCrypto?.imageUrl}`}
            alt={selectedCrypto?.crypto || ""}
            width={50}
            height={50}
          />
          <p className="font-bold text-xl text-white">
            {selectedCrypto?.crypto}
          </p>
        </div>
        <div className="pt-4 flex flex-col gap-2">
          <Label htmlFor="amount" className="text-white text-[1rem]">
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            value={amount.toString()}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            placeholder={selectedCrypto?.crypto}
            className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold placeholder:text-right"
            style={{
              WebkitAppearance: "none",
              MozAppearance: "textfield",
            }}
          />
        </div>
        <div className="pt-4 flex flex-col gap-2">
          <Label htmlFor="price" className="text-white text-[1rem]">
            Price
          </Label>
          <Input
            id="price"
            type="number"
            // value={selectedCrypto?.price.toFixed(2)}
            className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold placeholder:text-right"
          />
        </div>
        <div className="pt-4 flex flex-col gap-2">
          <Label htmlFor="total" className="text-white text-[1rem]">
            Total
          </Label>
          <Input
            id="tolal"
            type="number"
            defaultValue="0.00"
            value={totalPrice}
            className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold placeholder:text-right"
          />
        </div>
        <div className="pt-4 flex flex-col gap-2">
          <Button
            onClick={() => {
              console.log({
                crypto: selectedCrypto?.crypto,
                amount,
                price: selectedCrypto?.price,
                total: totalPrice,
              });
              onAddTransaction(); // Llamar a onAddTransaction aquí
            }}
            className="bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white"
          >
            Add Transaction
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecondDialogContent;
