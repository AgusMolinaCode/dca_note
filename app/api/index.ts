const BASE_URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,SOL,FET,RUNE,BCH,BNB,APT,NEXO,TON,NEAR,XRP&tsyms=USD&api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`;

export const getCryptos = async (): Promise<CryptoListResult> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => {
    return fetch(`${BASE_URL}`).then((res) => res.json());
  });
};
