import { Component } from '@angular/core';
import { FaqComponent } from '../../shell/faq/faq.component';
import { ContactsComponent } from "../contacts/contacts.component";

@Component({
  selector: 'app-home',
  imports: [FaqComponent, ContactsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
