import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { AppModule } from '../../app.module';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      declarations: [SearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly update the search term', waitForAsync(() => {
    const element = fixture.nativeElement;

    const inputElement = element.querySelector('input');
    inputElement.value = 'test';

    inputElement.dispatchEvent(new Event('input')); // Update the model

    expect(component.searchValue).toEqual('test');
  }));

  it('should correctly emit the updated search term', waitForAsync(() => {
    component.search.subscribe(search => {
      expect(search).toEqual('test');
    });

    component.searchValue = 'test';
    component.onSearch();
  }));

  it('should debounce the search term', waitForAsync(() => {
    let count = 0;
    component.search.subscribe(() => {
      count++;
    });

    component.searchValue = 'test';
    component.onSearch();

    setTimeout(() => {
      expect(count).toEqual(0);
    }, 150);

    setTimeout(() => {
      expect(count).toEqual(1);
    }, 250);
  }));
});
