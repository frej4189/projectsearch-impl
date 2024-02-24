import { Component, EventEmitter, Output } from '@angular/core';
import { UnaryFunction } from 'rxjs';
import { Product } from '../../products';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {

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
  }

  private broadcastFilters() {
    this.filters.emit([this.searchFilter, this.priceFilter]);
  }
}
