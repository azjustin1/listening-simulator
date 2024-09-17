import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfReadingComponent } from './self-reading.component';

describe('SelfReadingComponent', () => {
  let component: SelfReadingComponent;
  let fixture: ComponentFixture<SelfReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfReadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
