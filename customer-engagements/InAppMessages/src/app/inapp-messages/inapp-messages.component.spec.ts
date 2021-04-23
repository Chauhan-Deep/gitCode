import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InAppMessagesComponent } from './inapp-messages.component';

describe('InAppMessagesComponent', () => {
    let component: InAppMessagesComponent;
    let fixture: ComponentFixture<InAppMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [InAppMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(InAppMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
