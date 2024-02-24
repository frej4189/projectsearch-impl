import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../products';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable, Subject, map, of, tap } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrl: './explorer.component.scss'
})
export class ExplorerComponent implements OnChanges {

  @Input() products: Product[] = [];
  dataSource = new ProductDataSource();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onSortData() {
    this.dataSource.update(this.getPagedData(this.sortData(this.products)));
  }

  sortData(data: Product[]): Product[] {
    if(!this.sort) return data;
    const mult = this.sort.direction === 'asc' ? 1 : -1;
    switch(this.sort.active) {
      case 'price':
        return data.sort((a, b) => ((a.price ?? 0) - (b.price ?? 0)) * mult); // Compares the price of two products and flips the result if the sort direction is descending
      case 'title':
        return data.sort((a, b) => a.title.localeCompare(b.title) * mult); // Compares the title of two products and flips the result if the sort direction is descending
    }

    return data;
  }

  changePage(event: PageEvent) {
    this.dataSource.update(this.getPagedData(this.products));
  }

  ngOnChanges() {
    this.dataSource.update(this.getPagedData(this.sortData(this.products)));
  }

  private getPagedData(data: Product[]) {
    if(!this.paginator) return data;

    return data.slice(this.getStartIndex(), this.getEndIndex());
  }

  private getStartIndex() {
    return this.paginator.pageIndex * this.paginator.pageSize;
  }

  private getEndIndex() {
    return (this.paginator.pageIndex + 1) * this.paginator.pageSize;
  }
}

class ProductDataSource extends DataSource<Product> {
  private products: Subject<Product[]> = new Subject<Product[]>();

  constructor() {
    super();
  }

  connect(): Observable<Product[]> {
    return this.products;
  }

  disconnect() {
    this.products.complete();
  }

  update(data: Product[]) {
    this.products.next(data);
  }
}