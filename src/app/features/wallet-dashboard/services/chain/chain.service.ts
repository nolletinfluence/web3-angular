import { Injectable } from "@angular/core";
import { shareReplay, type Observable } from "rxjs";

import { ApiClientService } from "@core/api/api-client/api-client.service";
import type { Chain } from "../../models";

@Injectable({ providedIn: "root" })
export class ChainService {
  private readonly chains$ = this.apiClient
    .get<Chain[]>("/api/chains")
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  constructor(private readonly apiClient: ApiClientService) {}

  getChains(): Observable<Chain[]> {
    return this.chains$;
  }
}
