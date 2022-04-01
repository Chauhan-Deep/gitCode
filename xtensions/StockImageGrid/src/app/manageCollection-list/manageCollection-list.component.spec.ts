import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCollectionsListComponent } from './manageCollection-list.component';

describe('ManageCollectionsListComponent', () => {
  let component: ManageCollectionsListComponent;
  let fixture: ComponentFixture<ManageCollectionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCollectionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCollectionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
