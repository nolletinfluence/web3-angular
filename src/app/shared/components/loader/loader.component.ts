import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-loader",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./loader.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  @Input() message = "Загружаем данные...";
  @Input() hint?: string;
}
