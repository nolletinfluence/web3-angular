import { Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { ApiClientService } from "@core/api/api-client/api-client.service";
import type { Transaction } from "../../models";

@Injectable({ providedIn: "root" })
export class TransactionService {
  constructor(private readonly apiClient: ApiClientService) {}

  getTransactions(address: string, chainId: string, limit = 10): Observable<Transaction[]> {
    return this.apiClient
      .get<Transaction[]>(`/api/transactions/${address}`, {
        chain: chainId,
        limit,
      })
      .pipe(map((transactions) => normalizeTransactions(transactions)));
  }
}

const normalizeTransactions = (
  transactions: Partial<Transaction>[] | null | undefined,
): Transaction[] => {
  if (!Array.isArray(transactions)) {
    return [];
  }

  return transactions.map((tx, index) => ({
    hash: safeString(tx.hash, `tx-${index + 1}`),
    from: safeString(tx.from, "-"),
    to: safeString(tx.to, "-"),
    value: typeof tx.value === "string" ? tx.value : String(tx.value ?? "0"),
    symbol: safeString(tx.symbol, ""),
    timestamp: safeNumber(tx.timestamp, Number.NaN),
    status: safeString(tx.status, "unknown"),
  }));
};

const safeString = (value: string | undefined, fallback: string): string => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
};

const safeNumber = (value: number | undefined, fallback: number): number => {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }

  return value;
};
