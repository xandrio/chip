import { Component, OnInit } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { TranslateModule } from '@ngx-translate/core';
import { ContactService } from '../../shared/services/contact.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';

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
  siteKey = 'YOUR_RECAPTCHA_SITE_KEY';
  captchaError = false;

  constructor(private fb: FormBuilder, private contact: ContactService) {
    this.requestForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+ ()-]+$/)]],
      model: [''],
      description: [''],
    });
  }

  ngOnInit() {}

  onCaptchaResolved(token: string) {
    this.captchaToken = token;
  }

  submitRequest() {
    if (this.requestForm.valid) {
      const payload = {
        ...this.requestForm.value,
        token: this.captchaToken,
      };
      this.contact.sendRequest(payload).subscribe({
        next: () => {
          this.captchaError = false;
          console.log('Request sent');
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
