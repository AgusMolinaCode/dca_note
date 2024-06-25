import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Image from "next/image";

interface FirstDialogContentProps {
  query: string;
  setQuery: (query: string) => void;
  searchResults: CryptoListResult;
  isLoading: boolean;
  isSuccess: boolean;
  handleSelect: (crypto: string, price: string, imageUrl: string) => void;
}

const FirstDialogContent = ({
  query,
  setQuery,
  searchResults,
  isLoading,
  isSuccess,
  handleSelect,
}: FirstDialogContentProps) => {
  return (
    <div className="grid">
      <div className="">
        <Label htmlFor="searchCrypto" className="text-right text-white">
          Search for a crypto
        </Label>
      </div>
      <div className="pt-2">
        <Input
          id="searchCrypto"
          placeholder="Example: BTC, ETH, SOL, etc."
          className="col-span-3 placeholder:text-gray-500 rounded-xl border-gray-500 text-white font-bold"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
      </div>

      <div>
        <div>
          <ul>
            {isLoading && (
              <li className="flex justify-center my-2 py-1 items-center text-white">
                Loading...
              </li>
            )}
            {isSuccess &&
              searchResults?.DISPLAY &&
              Object.entries(searchResults.DISPLAY).map(
                ([crypto, cryptoData]) => {
                  const { MKTCAP, IMAGEURL, PRICE } = cryptoData.USD;
                  if (MKTCAP === "$ NaN" || PRICE === "0") {
                    return (
                      <li key={crypto}>
                        Error: {crypto} no tiene información de precio válida.
                      </li>
                    );
                  }
                  return (
                    <li key={crypto}>
                      <button
                        className="flex justify-center my-2 py-1 rounded-xl items-center mx-auto w-full gap-2 hover:bg-gray-300/20 cursor-pointer duration-300"
                        onClick={() => handleSelect(crypto, PRICE, IMAGEURL)}
                      >
                        <Image
                          src={`https://cryptocompare.com/${IMAGEURL}`}
                          alt={crypto}
                          width={30}
                          height={30}
                        />
                        <p className="font-bold text-white">{crypto}</p>
                        <p className="font-semibold text-white">{PRICE}</p>
                      </button>
                    </li>
                  );
                }
              )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FirstDialogContent;
