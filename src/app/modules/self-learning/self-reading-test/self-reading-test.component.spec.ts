import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfReadingTestComponent } from './self-reading-test.component';

describe('SelfReadingTestComponent', () => {
  let component: SelfReadingTestComponent;
  let fixture: ComponentFixture<SelfReadingTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfReadingTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfReadingTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
