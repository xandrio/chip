import { Component } from '@angular/core';
import { FaqComponent } from '../../shell/faq/faq.component';

@Component({
  selector: 'app-home',
  imports: [ FaqComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
