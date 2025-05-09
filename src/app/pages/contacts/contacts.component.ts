import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contacts',
  imports: [ NgbScrollSpyModule, ScrollspyDirective, TranslateModule ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

}
