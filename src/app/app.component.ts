import { Component, OnInit } from '@angular/core';
import { ProductsService } from './services/products.service';
import { Product } from './products';
import { BehaviorSubject } from 'rxjs';

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

}
