import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageSelectionComponent } from '../language-selection/language-selection.component';

@Component({
  selector: 'app-navigation',
  imports: [ RouterLink, RouterLinkActive, LanguageSelectionComponent ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  protected showMenu: boolean = false;
}
