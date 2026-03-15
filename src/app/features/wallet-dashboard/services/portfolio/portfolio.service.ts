import { Injectable } from "@angular/core";
import type { Observable } from "rxjs";

import { ApiClientService } from "@core/api/api-client/api-client.service";
import type { Portfolio } from "../../models";

@Injectable({ providedIn: "root" })
export class PortfolioService {
  constructor(private readonly apiClient: ApiClientService) {}

  getPortfolio(chainId: string, address: string): Observable<Portfolio> {
    return this.apiClient.get<Portfolio>(`/api/portfolio/${address}`, {
      chain: chainId,
    });
  }
}
