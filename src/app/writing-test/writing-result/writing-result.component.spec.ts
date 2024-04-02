import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingResultComponent } from './writing-result.component';

describe('WritingResultComponent', () => {
  let component: WritingResultComponent;
  let fixture: ComponentFixture<WritingResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritingResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WritingResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
