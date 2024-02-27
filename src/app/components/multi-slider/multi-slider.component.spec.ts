import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultiSliderComponent } from './multi-slider.component';
import { AppModule } from '../../app.module';

describe('MultiSliderComponent', () => {
  let component: MultiSliderComponent;
  let fixture: ComponentFixture<MultiSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      declarations: [MultiSliderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiSliderComponent);
    component = fixture.componentInstance;
    component.minimumPrice = 1;
    component.maximumPrice = 10;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the slider', () => {
    const element = fixture.nativeElement;
    const sliderElement = element.querySelector('mat-slider');
    expect(sliderElement).toBeTruthy();
  });
  
  it('should correctly render default minimum and maximum', async () => {
    const element = fixture.nativeElement;

    const inputElements = element.querySelectorAll('input');
    expect(inputElements[0].value).toEqual('1'); // First input is for minimum
    expect(inputElements[3].value).toEqual('10'); // Second and third inputs are for the slider. Fourth input is maximum
  });

  it('should correctly update the selected values', async () => {
    const element = fixture.nativeElement;

    const inputElements = element.querySelectorAll('input');
    inputElements[0].value = '5';
    inputElements[0].dispatchEvent(new Event('input')); // Update the model

    expect(component.minSelected).toEqual(5);

    inputElements[3].value = '8';
    inputElements[3].dispatchEvent(new Event('input')); // Update the model

    expect(component.maxSelected).toEqual(8);
  });

  it('should correctly update the selected values when they are out of range', async () => {
    const element = fixture.nativeElement;

    const inputElements = element.querySelectorAll('input');
    inputElements[0].value = '11';
    inputElements[0].dispatchEvent(new Event('input')); // Update the model
    inputElements[0].dispatchEvent(new Event('keyup')); // Trigger the validator

    expect(component.minSelected).toEqual(10);

    inputElements[0].value = '1'; // Reset the value
    inputElements[0].dispatchEvent(new Event('input')); // Update the model

    inputElements[3].value = '-1';
    inputElements[3].dispatchEvent(new Event('input')); // Update the model
    inputElements[3].dispatchEvent(new Event('keyup')); // Trigger the validator

    expect(component.maxSelected).toEqual(1);
  });

  it('should correctly limit the maximum value to the minimum value', async () => {
    const element = fixture.nativeElement;

    const inputElements = element.querySelectorAll('input');
    inputElements[0].value = '5';
    fixture.detectChanges();
    inputElements[0].dispatchEvent(new Event('input')); // Update the model
    inputElements[0].dispatchEvent(new Event('keyup')); // Trigger the validator

    inputElements[3].value = '3';
    fixture.detectChanges();
    inputElements[3].dispatchEvent(new Event('input')); // Update the model
    inputElements[3].dispatchEvent(new Event('keyup')); // Trigger the validator

    expect(component.maxSelected).toEqual(5);
  });

  it('should correctly limit the minimum value to the maximum value', async () => {
    const element = fixture.nativeElement;

    const inputElements = element.querySelectorAll('input');
    inputElements[3].value = '3';
    fixture.detectChanges();
    inputElements[3].dispatchEvent(new Event('input')); // Update the model
    inputElements[3].dispatchEvent(new Event('keyup')); // Trigger the validator

    inputElements[0].value = '5';
    fixture.detectChanges();
    inputElements[0].dispatchEvent(new Event('input')); // Update the model
    inputElements[0].dispatchEvent(new Event('keyup')); // Trigger the validator

    expect(component.minSelected).toEqual(3);
  });

  it('should correctly update the selected values when the slider is moved', async () => {
    const element = fixture.nativeElement;

    const inputElement = element.querySelectorAll('input');
    inputElement[1].value = 5;
    inputElement[1].dispatchEvent(new Event('input'));

    expect(component.minSelected).toEqual(5);

    inputElement[2].value = 8;
    inputElement[2].dispatchEvent(new Event('input'));

    expect(component.maxSelected).toEqual(8);
  });

  it('should correctly emit the selected values when changed', waitForAsync(() => {
    component.selectedPriceRange.subscribe(values => {
      expect(values).toEqual([500, 800]); // Ranges are emitted in cents
    });

    const element = fixture.nativeElement;

    const inputElement = element.querySelectorAll('input');
    inputElement[0].value = 5;
    inputElement[0].dispatchEvent(new Event('input')); // Update the model
    inputElement[0].dispatchEvent(new Event('keyup')); // Trigger the validator (in turn sends data to the event emitter)

    inputElement[3].value = 8;
    inputElement[3].dispatchEvent(new Event('input'));
    inputElement[3].dispatchEvent(new Event('keyup'));
  }));

  it('should debounce the event emitter', waitForAsync(() => {
    let count = 0;
    component.selectedPriceRange.subscribe(() => {
      count++;
    });

    const element = fixture.nativeElement;

    const inputElement = element.querySelectorAll('input');
    inputElement[0].value = 5;
    inputElement[0].dispatchEvent(new Event('input')); // Update the model
    inputElement[0].dispatchEvent(new Event('keyup')); // Trigger the validator (in turn sends data to the event emitter)

    inputElement[3].value = 8;
    inputElement[3].dispatchEvent(new Event('input'));
    inputElement[3].dispatchEvent(new Event('keyup'));

    setTimeout(() => {
      expect(count).toEqual(0);
    }, 150);

    setTimeout(() => {
      expect(count).toEqual(1);
    }, 250);
  }));
});
