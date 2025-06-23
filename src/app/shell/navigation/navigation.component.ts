import { afterNextRender, ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, IsActiveMatchOptions, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageSelectionComponent } from '../language-selection/language-selection.component';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { NgbScrollSpyModule, NgbScrollSpyService } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Helper } from '../../shared/helper';
import { BehaviorSubject, combineLatest, filter, map, Observable } from 'rxjs';
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
  private currentLangSubject = new BehaviorSubject<string>('es');
  public currentLang$ = this.currentLangSubject.asObservable();

  public navButtons = [
    { section: 'home', key: 'NAVIGATION.HOME' },
    { section: 'contacts', key: 'NAVIGATION.CONTACTS' },
    { section: 'faq', key: 'NAVIGATION.FAQ' },
    { section: 'status', key: 'NAVIGATION.STATUS' }
  ];

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
    // const routeLang = this.route.snapshot.firstChild?.paramMap.get('lang');
    // this.currentLangSubject.next(this.translate.currentLang);
    this.currentLangSubject.next('ru');

    // this.translate.onLangChange.subscribe((event) => {
    //   // console.log('Language changed to 4444444444:', event.lang);
    //   this.currentLangSubject.next(event.lang);
    //   this.cdr.markForCheck();
    // });

    // this.router.events
    //   .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     const lang = this.route.snapshot.firstChild?.paramMap.get('lang');
    //     if (lang) {
    //       this.currentLangSubject.next(lang);
    //       console.log('Language changed to:', lang);
    //       this.cdr.markForCheck();
    //     }
    //   });

    // this.route.paramMap.subscribe(params => {
    //   const lang = params.get('lang');
    //   if (lang) {
    //     this.currentLangSubject.next(lang);
    //     console.log('Language changed to >>>>>> :', lang);
    //     this.cdr.markForCheck();
    //   }
    // });
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

  public getRouterLink(section: string): string | undefined {
    return `/${this.currentLangSubject.value}/${section}`;
  }
}
