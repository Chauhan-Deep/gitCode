import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishResultsComponent } from './finish-results.component';

describe('FinishResultsComponent', () => {
  let component: FinishResultsComponent;
  let fixture: ComponentFixture<FinishResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
