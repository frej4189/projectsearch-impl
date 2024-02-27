import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerComponent } from './explorer.component';
import { AppModule } from '../../app.module';
import { Product } from '../../products';
import { ProductsService } from '../../services/products.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

describe('ExplorerComponent', () => {
  let component: ExplorerComponent;
  let fixture: ComponentFixture<ExplorerComponent>;

  const fakeProducts: Product[] = [];
  for(let i = 1; i <= 10; i++) {
    fakeProducts.push({
      productno: i.toString(),
      title: `Product ${i}`,
      price: i * 100
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppModule,
        MatFormFieldModule,
        MatPaginator,
        MatInputModule,
        MatTableModule
      ],
      declarations: [ExplorerComponent],
      providers: []
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExplorerComponent);
    component = fixture.componentInstance;
    component.products = fakeProducts;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of products', async () => {
    fixture.detectChanges();
    const element = fixture.nativeElement;

    expect(component.products).toEqual(fakeProducts);
    component.ngOnChanges(); // We need to call this manually because ngOnChanges is not called automatically in tests
    fixture.detectChanges();
    await fixture.whenStable();

    const tableElement  = element.querySelector('table');
    expect(tableElement).toBeTruthy();

    const rows = tableElement.querySelectorAll('tbody > tr');
    expect(rows.length).toBeGreaterThan(0);

    const cells = rows[0].querySelectorAll('td');
    expect(cells.length).toBe(2);
    expect(cells[0].innerHTML).toEqual(fakeProducts[0].title);
    expect(cells[1].innerHTML).toEqual(`$1.00`);
  });

  it('should paginate data', async () => {
    fixture.detectChanges();
    const element = fixture.nativeElement;

    expect(component.products).toEqual(fakeProducts);
    component.ngOnChanges(); // We need to call this manually because ngOnChanges is not called automatically in tests
    fixture.detectChanges();
    await fixture.whenStable();

    const tableElement  = element.querySelector('table');
    expect(tableElement).toBeTruthy();

    const paginatorElement = element.querySelector('mat-paginator');
    expect(paginatorElement).toBeTruthy();

    const rows = tableElement.querySelectorAll('tbody > tr');
    expect(rows.length).toBeGreaterThan(0);

    const cells = rows[0].querySelectorAll('td');
    expect(cells.length).toBe(2);

    expect(cells[0].innerHTML).toEqual(fakeProducts[0].title);
    expect(cells[1].innerHTML).toEqual(`$1.00`);

    const paginator = component.paginator;
    expect(paginator).toBeTruthy();

    paginator.pageSize = 5;
    paginator.pageIndex = 1;

    component.changePage();

    fixture.detectChanges();
    await fixture.whenStable();

    const rows2 = tableElement.querySelectorAll('tbody > tr');
    expect(rows2.length).toBeGreaterThan(0);

    const cells2 = rows2[0].querySelectorAll('td');
    expect(cells2.length).toBe(2);

    expect(cells2[0].innerHTML).toEqual(fakeProducts[5].title);
    expect(cells2[1].innerHTML).toEqual(`$6.00`);
  });

  it('should sort products by name', async () => {
    fixture.detectChanges();
    const element = fixture.nativeElement;

    const sortButtons = element.querySelectorAll('th.mat-sort-header > div[role="button"]');
    expect(sortButtons[0]).toBeTruthy();

    // Click "name" sort header = alphabetically ascending
    sortButtons[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const tableElement  = element.querySelector('table');
    expect(tableElement).toBeTruthy();

    const rows = tableElement.querySelectorAll('tbody > tr');
    expect(rows.length).toBeGreaterThan(0);

    const cells = rows[0].querySelectorAll('td');
    expect(cells.length).toBe(2);
    expect(cells[0].innerHTML).toEqual(fakeProducts[0].title);
    expect(cells[1].innerHTML).toEqual(`$1.00`);

    // Click header again = alphabetically descending
    sortButtons[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const rows2 = tableElement.querySelectorAll('tbody > tr');
    expect(rows2.length).toBeGreaterThan(0);

    const cells2 = rows2[0].querySelectorAll('td');
    expect(cells2.length).toBe(2);

    expect(cells2[0].innerHTML).toEqual(fakeProducts[8].title); // Alphabetically last (10 is after 9)
    expect(cells2[1].innerHTML).toEqual(`$9.00`);
  });

  it('should sort products by price', async () => {
    fixture.detectChanges();
    const element = fixture.nativeElement;

    const sortButtons = element.querySelectorAll('th.mat-sort-header > div[role="button"]');
    expect(sortButtons[1]).toBeTruthy();
    
    // Click "price" sort header = lowest price first
    sortButtons[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const tableElement  = element.querySelector('table');
    expect(tableElement).toBeTruthy();

    const rows = tableElement.querySelectorAll('tbody > tr');
    expect(rows.length).toBeGreaterThan(0);

    const cells = rows[0].querySelectorAll('td');
    expect(cells.length).toBe(2);
    expect(cells[0].innerHTML).toEqual(fakeProducts[0].title);
    expect(cells[1].innerHTML).toEqual(`$1.00`);

    // Click header again = highest price first
    sortButtons[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const rows2 = tableElement.querySelectorAll('tbody > tr');
    expect(rows2.length).toBeGreaterThan(0);

    const cells2 = rows2[0].querySelectorAll('td');
    expect(cells2.length).toBe(2);
    expect(cells2[0].innerHTML).toEqual(fakeProducts[9].title); // Price is highest
    expect(cells2[1].innerHTML).toEqual(`$10.00`);
  });
});
