import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FiltersComponent } from './filters.component';
import { AppModule } from '../../app.module';
import { Product } from '../../products';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;

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
        AppModule
      ],
      declarations: [FiltersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    component.products = fakeProducts;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly calculate price range', () => {
    expect(component.calculateMinimumPrice()).toEqual(1); // Price range is calculated in whole dollars
    expect(component.calculateMaximumPrice()).toEqual(10);
  });

  it('should correctly filter products by price', waitForAsync(() => {
    component.filters.subscribe(filters => {
      const products = filters.reduce((acc, filter) => filter(acc), component.products);

      expect(products).toEqual(fakeProducts.filter(p => p.price! >= 300 && p.price! <= 600));
    });
    component.updatePriceFilter(300, 600);
  }));

  it('should correctly filter products by search', waitForAsync(() => {
    component.filters.subscribe(filters => {
      const products = filters.reduce((acc, filter) => filter(acc), component.products);

      expect(products).toEqual(fakeProducts.filter(p => p.title.toLowerCase().includes('2') || p.title.toLowerCase().includes('3')));
    });
    component.updateSearchFilter('2 3');
  }));
});
