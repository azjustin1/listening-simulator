import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfReadingDetailComponent } from './self-reading-detail.component';

describe('SelfReadingDetailComponent', () => {
  let component: SelfReadingDetailComponent;
  let fixture: ComponentFixture<SelfReadingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfReadingDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfReadingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
