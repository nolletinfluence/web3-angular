import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";

import { ChainService } from "./chain.service";
import { API_BASE_URL } from "@core/config/api/api";

describe("ChainService", () => {
  let service: ChainService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ChainService],
    });

    service = TestBed.inject(ChainService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should fetch and cache chains", () => {
    service.getChains().subscribe();
    service.getChains().subscribe();

    const request = httpMock.expectOne(`${API_BASE_URL}/api/chains`);
    expect(request.request.method).toBe("GET");

    request.flush([
      {
        id: "ethereum",
        name: "Ethereum",
        chainId: 1,
        nativeCurrency: { symbol: "ETH", decimals: 18 },
        type: "evm",
      },
    ]);
  });
});
