import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCollectionComponent } from './manageCollection.component';

describe('ManageCollectionComponent', () => {
  let component: ManageCollectionComponent;
  let fixture: ComponentFixture<ManageCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
