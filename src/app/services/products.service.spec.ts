import { TestBed, waitForAsync } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { HttpClientModule } from '@angular/common/http';
import { AppModule } from '../app.module';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ]
    });
    service = TestBed.inject(ProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of products', waitForAsync(() => {
    service.getProductList().subscribe(products => {
      expect(products?.length ?? 0).toBeGreaterThan(0);
    });
  }));
});
