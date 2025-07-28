import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ContactService } from '../../shared/services/contact.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

declare const grecaptcha: any;

@Component({
  selector: 'app-contacts',
  imports: [ NgbScrollSpyModule, ScrollspyDirective, TranslateModule, ReactiveFormsModule ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  standalone: true
})
export class ContactsComponent implements OnInit, AfterViewInit {
  requestForm: FormGroup;
  captchaToken = '';
  // Using Google's test site key for reCAPTCHA v2
  siteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
  captchaError = false;
  loading = false;
  recaptchaWidgetId?: number;
  @ViewChild('captchaRef') captchaElem?: ElementRef;

  constructor(
    private fb: FormBuilder,
    private contact: ContactService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.requestForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+ ()-]+$/)]],
      model: [''],
      description: [''],
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (typeof grecaptcha !== 'undefined' && this.captchaElem) {
      this.recaptchaWidgetId = grecaptcha.render(this.captchaElem.nativeElement, {
        sitekey: this.siteKey,
        callback: (token: string) => this.onCaptchaResolved(token),
      });
    }
  }

  onCaptchaResolved(token: string | null) {
    if (!token) {
      this.captchaError = true;
      return;
    }
    this.captchaToken = token;
  }

  submitRequest() {
    if (this.requestForm.valid) {
      this.loading = true;
      const payload = {
        ...this.requestForm.value,
        token: this.captchaToken,
      };
      this.contact.sendRequest(payload)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
        next: () => {
          this.captchaError = false;
          const msg = this.translate.instant('CONTACTS.REQUEST_SENT');
          this.toastr.success(msg);
          this.requestForm.reset();
          this.captchaToken = '';
          if (this.recaptchaWidgetId !== undefined) {
            grecaptcha.reset(this.recaptchaWidgetId);
          }
        },
        error: err => {
          if (err.status === 400) {
            this.captchaError = true;
          }
          console.error('Request failed', err);
          if (this.recaptchaWidgetId !== undefined) {
            grecaptcha.reset(this.recaptchaWidgetId);
          }
        }
      });
    } else {
      this.toastr.error(this.translate.instant('CONTACTS.FORM_INVALID'));
      this.captchaError = true;
    }
  }
}
