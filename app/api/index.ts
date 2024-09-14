const BASE_URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,SOL,FET,RUNE,BCH,BNB,APT,NEXO,TON,NEAR,XRP&tsyms=USD&api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`;

const SEARCH_URL = `https://min-api.cryptocompare.com/data/pricemultifull`;

const MULTIPLE_SEARCH_URL = `https://min-api.cryptocompare.com/data/pricemulti`;

const MULTIPLE_FULL_SEARCH_URL = `https://min-api.cryptocompare.com/data/pricemultifull`;

export const LOAD_TRANSACTIONS = `/api/transactions`;

export const LOAD_VALUES = `/api/values`;

const LOAD_USERS = `/api/users`;

export const LOAD_NOTES = `/api/notes`;

export const getCryptos = async (): Promise<CryptoListResult> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  }).then(() => {
    return fetch(`${BASE_URL}`).then((res) => res.json());
  });
};

export const getMultipleCryptos = async (
  query: string
): Promise<CryptoListResult> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  }).then(() => {
    return fetch(
      `${MULTIPLE_SEARCH_URL}?fsyms=${query}&tsyms=USD&api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`
    ).then((res) => res.json());
  });
};

export const getMultipleFullCryptos = async (
  query: string
): Promise<CryptoListResult> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  }).then(() => {
    return fetch(
      `${MULTIPLE_FULL_SEARCH_URL}?fsyms=${query}&tsyms=USD&api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`
    ).then((res) => res.json());
  });
};

export const searchCryptos = async (
  query: string
): Promise<CryptoListResult> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  }).then(() => {
    return fetch(
      `${SEARCH_URL}?fsyms=${query}&tsyms=USD&api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`
    ).then((res) => res.json());
  });
};

export const loadTransactions = async (): Promise<Transaction[]> => {
  return fetch(`${LOAD_TRANSACTIONS}`).then((res) => res.json());
};

export const loadUsers = async (): Promise<User[]> => {
  return fetch(`${LOAD_USERS}`).then((res) => res.json());
};

export const loadValues = async (): Promise<Value[]> => {
  return fetch(`${LOAD_VALUES}`).then((res) => res.json());
};

export const getNotes = async (): Promise<Notes[]> => {
  return fetch(`${LOAD_NOTES}`).then((res) => res.json());
};
