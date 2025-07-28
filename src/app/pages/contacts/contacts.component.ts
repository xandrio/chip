import { Component, OnInit } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ContactService } from '../../shared/services/contact.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-contacts',
  imports: [ NgbScrollSpyModule, ScrollspyDirective, TranslateModule, ReactiveFormsModule, RecaptchaModule ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  standalone: true
})
export class ContactsComponent implements OnInit {
  requestForm: FormGroup;
  captchaToken = '';
  // Using Google's test site key for reCAPTCHA v2
  siteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
  captchaError = false;
  loading = false;

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
        },
        error: err => {
          if (err.status === 400) {
            this.captchaError = true;
          }
          console.error('Request failed', err);
        }
      });
    }
  }
}
