import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInputComponent } from './client-input.component';

describe('ClientInputComponent', () => {
  let component: ClientInputComponent;
  let fixture: ComponentFixture<ClientInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
