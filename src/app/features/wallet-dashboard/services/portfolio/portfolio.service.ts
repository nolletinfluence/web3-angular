import { Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { ApiClientService } from "@core/api/api-client/api-client.service";
import type { Portfolio, TokenBalance } from "../../models";

@Injectable({ providedIn: "root" })
export class PortfolioService {
  constructor(private readonly apiClient: ApiClientService) {}

  getPortfolio(chainId: string, address: string): Observable<Portfolio> {
    return this.apiClient
      .get<Portfolio>(`/api/portfolio/${address}`, {
        chain: chainId,
      })
      .pipe(map((portfolio) => normalizePortfolio(portfolio, { chainId, address })));
  }
}

const normalizePortfolio = (
  portfolio: Partial<Portfolio> | null | undefined,
  fallback: { chainId: string; address: string },
): Portfolio => {
  const nativeBalance = normalizeTokenBalance(portfolio?.nativeBalance);
  const tokens = Array.isArray(portfolio?.tokens)
    ? portfolio.tokens.map((token) => normalizeTokenBalance(token))
    : [];
  const nativeUsd = nativeBalance.usdValue;
  const tokensUsd = tokens.reduce((total, token) => total + token.usdValue, 0);
  const totalUsdValue = safeNumber(portfolio?.totalUsdValue, nativeUsd + tokensUsd);

  return {
    address: safeString(portfolio?.address, fallback.address),
    chain: safeString(portfolio?.chain, fallback.chainId),
    nativeBalance,
    tokens,
    totalUsdValue,
  };
};

const normalizeTokenBalance = (
  token: Partial<TokenBalance> | null | undefined,
): TokenBalance => ({
  symbol: safeString(token?.symbol, "-"),
  balance: typeof token?.balance === "string" ? token.balance : "0",
  rawBalance: typeof token?.rawBalance === "string" ? token.rawBalance : "0",
  decimals: safeInteger(token?.decimals, 0),
  usdValue: safeNumber(token?.usdValue, 0),
  address: safeOptionalString(token?.address),
});

const safeInteger = (value: number | undefined, fallback: number): number => {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.floor(value));
};

const safeNumber = (value: number | undefined, fallback: number): number => {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }

  return value;
};

const safeString = (value: string | undefined, fallback: string): string => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
};

const safeOptionalString = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};
