import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchProductResponse } from '../products';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProductList() {
    return this.http.get<SearchProductResponse>('assets/products.json').pipe(
      map(response => response.content ?? [])
    );
  }
}