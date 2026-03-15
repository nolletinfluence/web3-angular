import { ChangeDetectionStrategy, Component } from "@angular/core";
import { WalletDashboardComponent } from "@features/wallet-dashboard";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [WalletDashboardComponent],
  templateUrl: "./app.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
