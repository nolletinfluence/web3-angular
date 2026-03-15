import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, type FormControl } from "@angular/forms";

import type { Chain } from "../../models";

@Component({
  selector: "app-chain-select",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./chain-select.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChainSelectComponent {
  @Input({ required: true }) chains: Chain[] = [];
  @Input({ required: true }) control!: FormControl<string>;
  @Input() disabled = false;
}
