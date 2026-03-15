import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import type { Observable } from "rxjs";

import { API_BASE_URL } from "@core/config/api/api";

type QueryParams = Record<string, string | number | boolean | undefined>;

@Injectable({ providedIn: "root" })
export class ApiClientService {
  constructor(private readonly http: HttpClient) {}

  get<T>(path: string, params?: QueryParams): Observable<T> {
    const httpParams = params ? new HttpParams({ fromObject: this.toParams(params) }) : undefined;
    return this.http.get<T>(`${API_BASE_URL}${path}`, { params: httpParams });
  }

  private toParams(params: QueryParams): Record<string, string> {
    return Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }

      acc[key] = String(value);
      return acc;
    }, {});
  }
}
