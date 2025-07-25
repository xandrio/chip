import { Component } from '@angular/core';
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
export class ContactsComponent {
  requestForm: FormGroup;
  captchaA = Math.floor(Math.random() * 10) + 1;
  captchaB = Math.floor(Math.random() * 10) + 1;
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

  submitRequest() {
    if (this.requestForm.valid) {
      const expected = this.captchaA + this.captchaB;
      const provided = Number(this.requestForm.get('captcha')!.value);
      if (provided !== expected) {
        this.captchaError = true;
        return;
      }
      this.captchaError = false;
      this.contact.sendRequest(this.requestForm.value).subscribe({
        next: () => console.log('Request sent'),
        error: err => console.error('Request failed', err)
      });
    }
  }
}
