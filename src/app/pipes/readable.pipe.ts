import { Pipe, PipeTransform } from '@angular/core';

// Transforms a price in cents to a human-readable price (e.g. 1234 -> 12.34 & 10 -> 0.10)

@Pipe({
  name: 'readable'
})
export class ReadablePipe implements PipeTransform {

  transform(value?: number | null): string {
    if (value === undefined || value === null) { // !value will not work for free products (which should render as 0.00)
      return 'N/A';
    }
    const stringValue = value.toString().padStart(3, '0');
    return `$${stringValue.slice(0, -2)}.${stringValue.slice(-2)}`;
  }

}
