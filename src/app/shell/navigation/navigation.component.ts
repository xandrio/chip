import { afterNextRender, Component } from '@angular/core';
import { IsActiveMatchOptions, RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageSelectionComponent } from '../language-selection/language-selection.component';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { NgbScrollSpyModule, NgbScrollSpyService } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navigation',
  imports: [ RouterLink, RouterLinkActive, LanguageSelectionComponent, NgbScrollSpyModule ],
  providers: [],
  standalone: true,
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  protected showMenu: boolean = false;
  protected fragmentExact: IsActiveMatchOptions = {
    matrixParams: 'exact', 
    queryParams: 'exact', 
    paths: 'exact',
    fragment: 'exact'
  };
  constructor() { 
  }
}
