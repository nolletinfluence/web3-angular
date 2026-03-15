import { Pipe, type PipeTransform } from "@angular/core";

import { formatUsd } from "@core/utils/format/format.util";

@Pipe({
  name: "usd",
  standalone: true,
})
export class UsdPipe implements PipeTransform {
  transform(value: number): string {
    return formatUsd(value);
  }
}
