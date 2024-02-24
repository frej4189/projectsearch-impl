import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { Product } from './products';
import { of } from 'rxjs';
import { ProductsService } from './services/products.service';

describe('AppComponent', () => {
  let app: AppComponent;
  const fakeProducts: Product[] = [
    {
      productno: '1',
      title: 'Product 1',
      price: 100
    },
    {
      productno: '2',
      title: 'Product 2',
      price: 200
    }
  ];

  beforeEach(async () => {
    const dummyProductsService = jasmine.createSpyObj('ProductsService', ['getProductList']);
    dummyProductsService.getProductList.and.returnValue(of(fakeProducts));

    await TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: ProductsService, useValue: dummyProductsService }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should populate products on init', waitForAsync(() => {
    console.log("ngOnInit");
    app.ngOnInit();
    
    app.products.subscribe(products => {
      expect(products).toEqual(fakeProducts);
    });
  }));
});
