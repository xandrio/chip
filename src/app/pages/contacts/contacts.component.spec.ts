import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ContactsComponent } from './contacts.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
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

  it('should load captcha on init', () => {
    const service = TestBed.inject(ContactService);
    const spy = spyOn(service, 'getCaptcha').and.returnValue(of({ id: '1', image: 'data' }));
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set captchaError when server rejects captcha', () => {
    const service = TestBed.inject(ContactService);
    spyOn(service, 'getCaptcha').and.returnValue(of({ id: '1', image: 'data' }));
    spyOn(service, 'sendRequest').and.returnValue(throwError(() => ({ status: 400 })));

    component.ngOnInit();
    component.requestForm.setValue({
      name: 'Test',
      phone: '123',
      model: '',
      description: '',
      captcha: '0'
    });

    component.submitRequest();
    expect(component.captchaError).toBeTrue();
  });
});
