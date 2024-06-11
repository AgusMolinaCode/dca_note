interface CryptoCurrency {
  USD: {
    TYPE: string;
    MARKET: string;
    FROMSYMBOL: string;
    TOSYMBOL: string;
    FLAGS: string;
    LASTMARKET: string;
    MEDIAN: number;
    TOPTIERVOLUME24HOUR: number;
    TOPTIERVOLUME24HOURTO: number;
    LASTTRADEID: string;
    PRICE: number;
    LASTUPDATE: number;
    LASTVOLUME: number;
    LASTVOLUMETO: number;
    VOLUMEHOUR: number;
    VOLUMEHOURTO: number;
    OPENHOUR: number;
    HIGHHOUR: number;
    LOWHOUR: number;
    VOLUMEDAY: number;
    VOLUMEDAYTO: number;
    OPENDAY: number;
    HIGHDAY: number;
    LOWDAY: number;
    VOLUME24HOUR: number;
    VOLUME24HOURTO: number;
    OPEN24HOUR: number;
    HIGH24HOUR: number;
    LOW24HOUR: number;
    CHANGE24HOUR: number;
    CHANGEPCT24HOUR: number;
    CHANGEDAY: number;
    CHANGEPCTDAY: number;
    CHANGEHOUR: number;
    CHANGEPCTHOUR: number;
    CONVERSIONTYPE: string;
    CONVERSIONSYMBOL: string;
    CONVERSIONLASTUPDATE: number;
    SUPPLY: number;
    MKTCAP: number;
    MKTCAPPENALTY: number;
    CIRCULATINGSUPPLY: number;
    CIRCULATINGSUPPLYMKTCAP: number;
    TOTALVOLUME24H: number;
    TOTALVOLUME24HTO: number;
    TOTALTOPTIERVOLUME24H: number;
    TOTALTOPTIERVOLUME24HTO: number;
    IMAGEURL: string;
  };
}

interface DisplayCryptoCurrency {
  USD: {
    FROMSYMBOL: string;
    TOSYMBOL: string;
    MARKET: string;
    LASTMARKET: string;
    TOPTIERVOLUME24HOUR: string;
    TOPTIERVOLUME24HOURTO: string;
    LASTTRADEID: string;
    PRICE: string;
    LASTUPDATE: string;
    LASTVOLUME: string;
    LASTVOLUMETO: string;
    VOLUMEHOUR: string;
    VOLUMEHOURTO: string;
    OPENHOUR: string;
    HIGHHOUR: string;
    LOWHOUR: string;
    VOLUMEDAY: string;
    VOLUMEDAYTO: string;
    OPENDAY: string;
    HIGHDAY: string;
    LOWDAY: string;
    VOLUME24HOUR: string;
    VOLUME24HOURTO: string;
    OPEN24HOUR: string;
    HIGH24HOUR: string;
    LOW24HOUR: string;
    CHANGE24HOUR: string;
    CHANGEPCT24HOUR: string;
    CHANGEDAY: string;
    CHANGEPCTDAY: string;
    CHANGEHOUR: string;
    CHANGEPCTHOUR: string;
    CONVERSIONTYPE: string;
    CONVERSIONSYMBOL: string;
    CONVERSIONLASTUPDATE: string;
    SUPPLY: string;
    MKTCAP: string;
    MKTCAPPENALTY: string;
    CIRCULATINGSUPPLY: string;
    CIRCULATINGSUPPLYMKTCAP: string;
    TOTALVOLUME24H: string;
    TOTALVOLUME24HTO: string;
    TOTALTOPTIERVOLUME24H: string;
    TOTALTOPTIERVOLUME24HTO: string;
    IMAGEURL: string;
  };
}

interface CryptoListResult {
  RAW: {
    [key: string]: CryptoCurrency;
  };
  DISPLAY: {
    [key: string]: DisplayCryptoCurrency;
  };
}