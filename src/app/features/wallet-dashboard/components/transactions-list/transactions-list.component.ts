import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

import type { Transaction } from "../../models";
import {
  formatTimestamp,
  formatTransactionValue,
  shortenAddress,
  shortenHash,
} from "@core/utils/format/format.util";

@Component({
  selector: "app-transactions-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./transactions-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsListComponent {
  @Input({ required: true }) transactions: Transaction[] = [];

  readonly formatTimestamp = formatTimestamp;
  readonly formatTransactionValue = formatTransactionValue;
  readonly shortenHash = shortenHash;
  readonly shortenAddress = shortenAddress;

  trackByHash(index: number, tx: Transaction): string {
    return tx.hash ?? `${index}`;
  }

  statusLabel(status: string): string {
    if (status === "success") {
      return "Успех";
    }

    if (status === "failed") {
      return "Ошибка";
    }

    return status;
  }
}
