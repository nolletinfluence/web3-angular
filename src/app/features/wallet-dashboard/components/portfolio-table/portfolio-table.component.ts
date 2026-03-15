import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

import type { Portfolio, TokenBalance } from "../../models";
import { formatTokenAmount } from "@core/utils/format/format.util";
import { UsdPipe } from "@shared/pipes/usd/usd.pipe";

@Component({
  selector: "app-portfolio-table",
  standalone: true,
  imports: [CommonModule, UsdPipe],
  templateUrl: "./portfolio-table.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioTableComponent {
  @Input({ required: true }) portfolio!: Portfolio;

  readonly formatTokenAmount = formatTokenAmount;

  trackByToken(index: number, token: TokenBalance): string {
    return token.address ?? `${token.symbol}-${index}`;
  }
}
