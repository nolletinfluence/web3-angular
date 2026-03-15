import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { combineLatest, of, Subject, type Observable } from "rxjs";
import { catchError, map, startWith, switchMap, tap, withLatestFrom } from "rxjs/operators";

import { ChainService, PortfolioService, TransactionService } from "./services";
import type { Chain, Portfolio, Transaction } from "./models";
import { getAddressError } from "@core/utils/address/address.util";
import { ChainSelectComponent } from "./components/chain-select/chain-select.component";
import { AddressInputComponent } from "./components/address-input/address-input.component";
import { PortfolioTableComponent } from "./components/portfolio-table/portfolio-table.component";
import { TransactionsListComponent } from "./components/transactions-list/transactions-list.component";
import { LoaderComponent } from "@shared/components/loader/loader.component";

interface SearchParams {
  chainId: string;
  address: string;
}

type ChainsState =
  | { status: "loading"; chains: Chain[] }
  | { status: "error"; chains: Chain[]; error: string }
  | { status: "success"; chains: Chain[] };

type DashboardState =
  | { status: "idle" }
  | { status: "loading"; request: SearchParams }
  | { status: "error"; error: string }
  | { status: "success"; portfolio: Portfolio; transactions: Transaction[] };

@Component({
  selector: "app-wallet-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChainSelectComponent,
    AddressInputComponent,
    PortfolioTableComponent,
    TransactionsListComponent,
    LoaderComponent,
  ],
  templateUrl: "./wallet-dashboard.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletDashboardComponent {
  private readonly search$ = new Subject<SearchParams>();

  readonly form = this.formBuilder.group({
    chainId: this.formBuilder.control("", { validators: [Validators.required] }),
    address: this.formBuilder.control("", { validators: [Validators.required] }),
  });

  readonly chainsState$ = this.chainService.getChains().pipe(
    tap((chains) => this.ensureChainSelected(chains)),
    map((chains): ChainsState => ({ status: "success", chains })),
    startWith<ChainsState>({ status: "loading", chains: [] }),
    catchError(() =>
      of<ChainsState>({
        status: "error",
        chains: [],
        error: "Не удалось загрузить список сетей.",
      }),
    ),
  );

  readonly dashboardState$: Observable<DashboardState> = this.search$.pipe(
    withLatestFrom(this.chainsState$),
    switchMap(([params, chainsState]) => {
      if (chainsState.status !== "success") {
        return of({
          status: "error",
          error: "Список сетей недоступен. Попробуйте позже.",
        } as const);
      }

      const chain = chainsState.chains.find((item) => item.id === params.chainId);
      if (!chain) {
        return of({
          status: "error",
          error: "Выбранная сеть не найдена.",
        } as const);
      }

      const validationError = getAddressError(chain.type, params.address);
      if (validationError) {
        return of({ status: "error", error: validationError } as const);
      }

      return combineLatest([
        this.portfolioService.getPortfolio(chain.id, params.address),
        this.transactionService.getTransactions(params.address, chain.id, 10),
      ]).pipe(
        map(
          ([portfolio, transactions]) =>
            ({
              status: "success",
              portfolio,
              transactions,
            }) as const,
        ),
        startWith({ status: "loading", request: params } as const),
        catchError(() =>
          of({
            status: "error",
            error: "Не удалось загрузить данные. Проверьте адрес и доступность сети.",
          } as const),
        ),
      );
    }),
    startWith({ status: "idle" } as const),
  );

  readonly vm$ = combineLatest({
    chainsState: this.chainsState$,
    dashboardState: this.dashboardState$,
  });

  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly chainService: ChainService,
    private readonly portfolioService: PortfolioService,
    private readonly transactionService: TransactionService,
  ) {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const address = this.form.controls.address.value.trim();
    this.form.controls.address.setValue(address);

    this.search$.next({
      chainId: this.form.controls.chainId.value,
      address,
    });
  }

  private ensureChainSelected(chains: Chain[]): void {
    const current = this.form.controls.chainId.value;
    const hasCurrent = chains.some((chain) => chain.id === current);
    if (!hasCurrent && chains.length > 0) {
      this.form.controls.chainId.setValue(chains[0].id);
    }
  }
}
