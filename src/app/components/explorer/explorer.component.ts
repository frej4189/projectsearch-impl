import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../products';
import { MatSort, Sort } from '@angular/material/sort';
import { BehaviorSubject, Observable, Subject, map, of, take, tap } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrl: './explorer.component.scss'
})
export class ExplorerComponent implements OnChanges {

  private sortedData: Product[] = [];
  @Input() products: Product[] = [];
  dataSource = new ProductDataSource();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onSortData() {
    const sorted = this.sortData(this.products.slice()); // Clone the array to avoid modifying the original (to keep the original order).
    this.dataSource.update(sorted);
  }

  sortData(data: Product[]): Product[] {
    if(!this.sort || this.sort.direction === '') return data;
    
    const mult = this.sort.direction === 'asc' ? 1 : -1;
    switch(this.sort.active) {
      case 'price':
        return data.sort((a, b) => ((a.price ?? 0) - (b.price ?? 0)) * mult); // Compares the price of two products and flips the result if the sort direction is descending
      case 'title':
        return data.sort((a, b) => a.title.localeCompare(b.title) * mult); // Compares the title of two products and flips the result if the sort direction is descending
    }

    return data;
  }

  changePage() {
    this.dataSource.updatePage(this.paginator.pageSize, this.paginator.pageIndex);
  }

  ngOnChanges() {
    this.sortedData = this.sortData(this.products.slice()); // A bit inefficient but we should never send big chunks of data to the client anyway
    this.dataSource.update(this.sortedData);
  }

}

class ProductDataSource extends DataSource<Product> {
  private pageIndex = 0;
  private pageSize = 5;
  private products: Subject<Product[]> = new Subject<Product[]>();
  private data: Product[] = [];

  constructor() {
    super();
  }

  private getStartIndex() {
    return this.pageIndex * this.pageSize;
  }

  private getEndIndex() {
    return (this.pageIndex + 1) * this.pageSize;
  }

  private getPagedData(): Product[] {
    return this.data.slice(this.getStartIndex(), this.getEndIndex());
  }

  updatePage(pageSize: number, pageIndex: number) {
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.products.next(this.getPagedData());
  }

  connect(): Observable<Product[]> {
    return this.products;
  }

  disconnect() {
    this.products.complete();
  }

  update(data: Product[]) {
    this.data = data;
    this.products.next(this.getPagedData());
  }
}