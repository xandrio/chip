import { afterNextRender, ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, IsActiveMatchOptions, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageSelectionComponent } from '../language-selection/language-selection.component';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { NgbScrollSpyModule, NgbScrollSpyService } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Helper } from '../../shared/helper';
import { combineLatest, filter, map, merge, Observable } from 'rxjs';
import { ScrollSpyService } from '../../shared/services/scrollspy/scrollSpy.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation',
  imports: [ RouterLink, RouterLinkActive, LanguageSelectionComponent, NgbScrollSpyModule, AsyncPipe, TranslatePipe ],
  standalone: true,
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  protected showMenu: boolean = false;
  public active$: Observable<string | null> | null = null;
  public currentLang: string = 'en'; // Default language

  protected fragmentExact: IsActiveMatchOptions = {
    matrixParams: 'exact', 
    queryParams: 'exact', 
    paths: 'exact',
    fragment: 'exact'
  };
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private spy: ScrollSpyService,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.active$ = combineLatest([
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).pipe(map(() => {
          return Helper.getDeepestChild(this.route)?.snapshot.data;
        })),
        this.spy.activeSection$]
      ).pipe(map(([routeData, section]) => {
        return routeData?.['scrollspy'] === true ? section : null;
      }));
    }

  }
}
