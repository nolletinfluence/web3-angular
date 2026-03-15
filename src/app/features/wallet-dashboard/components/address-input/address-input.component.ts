import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, type FormControl } from "@angular/forms";

@Component({
  selector: "app-address-input",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./address-input.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressInputComponent {
  @Input({ required: true }) control!: FormControl<string>;
  @Input() disabled = false;
}
