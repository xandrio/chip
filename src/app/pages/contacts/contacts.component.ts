import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contacts',
  imports: [
    NgbScrollSpyModule,
    ScrollspyDirective,
    TranslateModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  standalone: true
})
export class ContactsComponent {
  contactForm: FormGroup;
  submitted = false;
  captchaRequired = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      message: ['']
    });
  }

  submitRequest() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    // Placeholder for backend call
    // this.http.post('/api/contact', this.contactForm.value).subscribe();
    console.log('Request submitted', this.contactForm.value);
    this.submitted = true;
    this.contactForm.reset();
  }
}
