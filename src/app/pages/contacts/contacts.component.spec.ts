import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ContactsComponent } from './contacts.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { throwError } from 'rxjs';
import { ContactService } from '../../shared/services/contact.service';

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ContactsComponent,
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set captchaError when server rejects captcha', () => {
    const service = TestBed.inject(ContactService);
    spyOn(service, 'sendRequest').and.returnValue(throwError(() => ({ status: 400 })));

    component.requestForm.setValue({
      name: 'Test',
      phone: '123',
      model: '',
      description: ''
    });
    component.captchaToken = 'token';

    component.submitRequest();
    expect(component.captchaError).toBeTrue();
  });
});
