import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shell/navigation/navigation.component';
import { FooterComponent } from './shell/footer/footer.component';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, NavigationComponent, FooterComponent, NgbScrollSpyModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chip';
}
