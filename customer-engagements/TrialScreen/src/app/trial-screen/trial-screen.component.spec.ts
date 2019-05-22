import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialScreenComponent } from './trial-screen.component';

describe('TrialScreenComponent', () => {
  let component: TrialScreenComponent;
  let fixture: ComponentFixture<TrialScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
