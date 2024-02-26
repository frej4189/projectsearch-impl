import { TestBed, waitForAsync } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppModule } from '../app.module';
import { of } from 'rxjs';

describe('ProductsService', () => {
  let service: ProductsService;
  const dummyHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
  const dummyProducts = {
    content: [
      {
        productno: '1',
        title: 'Product 1',
        price: 100
      },
      {
        productno: '2',
        title: 'Product 2',
        price: 200
      },
      {
        'productno': '3',
        title: ' Product 3',
        price: 300
      }
    ]
  }

  beforeEach(() => {
    dummyHttpClient.get.and.returnValue(of(dummyProducts));

    TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      providers: [
        ProductsService,
        { provide: HttpClient, useValue: dummyHttpClient }
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

  it('should return a list of products with trimmed titles', waitForAsync(() => {
    service.getProductList().subscribe(products => {
      products?.forEach(product => {
        expect(product.title).not.toMatch(/^\s/);
        expect(product.title).not.toMatch(/\s$/);
      });
    });
  }));
});
