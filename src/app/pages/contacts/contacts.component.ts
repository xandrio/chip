import { Component, OnInit } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { TranslateModule } from '@ngx-translate/core';
import { ContactService } from '../../shared/services/contact.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  imports: [ NgbScrollSpyModule, ScrollspyDirective, TranslateModule, ReactiveFormsModule ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  standalone: true
})
export class ContactsComponent implements OnInit {
  requestForm: FormGroup;
  captchaImage = '';
  captchaId = '';
  captchaError = false;

  constructor(private fb: FormBuilder, private contact: ContactService) {
    this.requestForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+ ()-]+$/)]],
      model: [''],
      description: [''],
      captcha: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCaptcha();
  }

  loadCaptcha() {
    this.contact.getCaptcha().subscribe(c => {
      this.captchaImage = c.image;
      this.captchaId = c.id;
    });
  }

  submitRequest() {
    if (this.requestForm.valid) {
      const payload = {
        ...this.requestForm.value,
        captchaId: this.captchaId,
      };
      this.contact.sendRequest(payload).subscribe({
        next: () => {
          this.captchaError = false;
          console.log('Request sent');
        },
        error: err => {
          if (err.status === 400) {
            this.captchaError = true;
            this.loadCaptcha();
          }
          console.error('Request failed', err);
        }
      });
    }
  }
}
