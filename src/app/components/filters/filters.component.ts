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
    else {
      const keywords = search.toLowerCase().split(/\s/);
      this.searchFilter = (products: Product[]) => {
        return products.filter(p => {
          const compareWith = p.title.toLowerCase();
          return keywords.some(k => compareWith.includes(k)); // Get products that contain at least one keyword from the search
        }).sort((a, b) => { // Sort products by the number of keywords found in the title (relevance). This will be overridden by price and/or name sorting
          const aIndex = keywords.reduce((acc, k) => acc + (a.title.toLowerCase().includes(k) ? 1 : 0), 0);
          const bIndex = keywords.reduce((acc, k) => acc + (b.title.toLowerCase().includes(k) ? 1 : 0), 0);
          return bIndex - aIndex;
        });
      }
    }

    this.broadcastFilters();
  }

  updatePriceFilter(min: number, max: number) {
    this.priceFilter = (products: Product[]) => products.filter(p => {
        if(!p.price) return false;
        return p.price >= min && p.price <= max;
    });

    this.broadcastFilters();
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