import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAutofillComponent } from './client-autofill.component';

describe('ClientAutofillComponent', () => {
  let component: ClientAutofillComponent;
  let fixture: ComponentFixture<ClientAutofillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAutofillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAutofillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
