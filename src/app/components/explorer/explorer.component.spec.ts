import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerComponent } from './explorer.component';
import { AppModule } from '../../app.module';

describe('ExplorerComponent', () => {
  let component: ExplorerComponent;
  let fixture: ComponentFixture<ExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      declarations: [ExplorerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
