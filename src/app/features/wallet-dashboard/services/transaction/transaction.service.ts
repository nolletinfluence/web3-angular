import { Injectable } from "@angular/core";
import type { Observable } from "rxjs";

import { ApiClientService } from "@core/api/api-client/api-client.service";
import type { Transaction } from "../../models";

@Injectable({ providedIn: "root" })
export class TransactionService {
  constructor(private readonly apiClient: ApiClientService) {}

  getTransactions(address: string, chainId: string, limit = 10): Observable<Transaction[]> {
    return this.apiClient.get<Transaction[]>(`/api/transactions/${address}`, {
      chain: chainId,
      limit,
    });
  }
}
