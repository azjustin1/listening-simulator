import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditWritingComponent } from './add-edit-writing.component';

describe('AddEditWritingComponent', () => {
  let component: AddEditWritingComponent;
  let fixture: ComponentFixture<AddEditWritingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditWritingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditWritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
