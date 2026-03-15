export interface TokenBalance {
  symbol: string;
  balance: string;
  rawBalance: string;
  decimals: number;
  usdValue: number;
  address?: string;
}

export interface Portfolio {
  address: string;
  chain: string;
  nativeBalance: TokenBalance;
  tokens: TokenBalance[];
  totalUsdValue: number;
}
