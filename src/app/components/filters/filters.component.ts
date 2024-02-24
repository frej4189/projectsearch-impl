import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UnaryFunction } from 'rxjs';
import { Product } from '../../products';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {

  @Input() products: Product[] = [];
  @Output() filters = new EventEmitter<UnaryFunction<Product[], Product[]>[]>();

  private searchFilter = (products: Product[]) => products;
  private priceFilter = (products: Product[]) => products;

  updateSearchFilter(search: string) {
    if(search === '') this.searchFilter = (products: Product[]) => products;
    else this.searchFilter = (products: Product[]) => products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

    this.broadcastFilters();
  }

  updatePriceFilter(min: number, max: number) {
    this.priceFilter = (products: Product[]) => products.filter(p => {
        if(!p.price) return false;
        return p.price >= min && p.price <= max;
    });

    this.broadcastFilters();

    console.log('Price filter updated');
  }

  calculateMinimumPrice() {
    if(this.products.length === 0) return 0;

    return (this.products.reduce((min, p) => (!min || p.price && p.price < min) ? p.price : min, this.products[0].price) ?? 0) / 100;
  }

  calculateMaximumPrice() {
    if(this.products.length === 0) return 0;

    return (this.products.reduce((max, p) => (!max || p.price && p.price > max) ? p.price : max, this.products[0].price) ?? 0) / 100;
  }

  private broadcastFilters() {
    this.filters.emit([this.searchFilter, this.priceFilter]);
  }
}
