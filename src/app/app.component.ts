import { Component, OnInit } from '@angular/core';
import { ProductsService } from './services/products.service';
import { Product } from './products';
import { BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.productsService.getProductList().subscribe(this.products);
  }

  updateFilters(filters: ((products: Product[]) => Product[])[]) {
    this.productsService.getProductList().pipe(
      map(products => filters.reduce((filteredProducts, filter) => filter(filteredProducts), products))
    ).subscribe(this.products);
  }
}
