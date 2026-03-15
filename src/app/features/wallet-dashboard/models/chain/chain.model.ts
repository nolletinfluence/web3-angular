import type { ChainType } from "@core/utils/address/address.util";

export interface ChainCurrency {
  symbol: string;
  decimals: number;
}

export interface Chain {
  id: string;
  name: string;
  chainId?: number;
  nativeCurrency: ChainCurrency;
  type: ChainType;
}
