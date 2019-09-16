import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchListViewComponent } from './search-list-view.component';

describe('SearchListViewComponent', () => {
  let component: SearchListViewComponent;
  let fixture: ComponentFixture<SearchListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
