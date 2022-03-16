import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddImageToCollectionsComponent } from './addimgtocollections.component';

describe('AddImageToCollectionsComponent', () => {
  let component: AddImageToCollectionsComponent;
  let fixture: ComponentFixture<AddImageToCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddImageToCollectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddImageToCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
