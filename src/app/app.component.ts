import { Component, Inject, DOCUMENT, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shell/navigation/navigation.component';
import { FooterComponent } from './shell/footer/footer.component';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { NgcCookieConsentService } from 'ngx-cookieconsent';


@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, NavigationComponent, FooterComponent, NgbScrollSpyModule ],
  providers: [TranslateService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'chip';
  private destroy$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private ccService: NgcCookieConsentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const lang = this.route.snapshot.firstChild?.paramMap.get('lang') ?? 'es';
      this.translate.use(lang);
    });

    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(e => {
      this.document.documentElement.lang = e.lang;
      this.updateCookieConsentContent();
    });
  }

  ngOnInit(): void {
    this.updateCookieConsentContent();
  }

  private updateCookieConsentContent(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.translate
      .get([
        'COOKIE.HEADER',
        'COOKIE.MESSAGE',
        'COOKIE.DISMISS',
        'COOKIE.ALLOW',
        'COOKIE.DENY',
        'COOKIE.LINK',
        'COOKIE.POLICY'
      ])
      .subscribe(data => {
        const config = this.ccService.getConfig();
        config.content = config.content || {};
        config.content.header = data['COOKIE.HEADER'];
        config.content.message = data['COOKIE.MESSAGE'];
        config.content.dismiss = data['COOKIE.DISMISS'];
        config.content.allow = data['COOKIE.ALLOW'];
        config.content.deny = data['COOKIE.DENY'];
        config.content.link = data['COOKIE.LINK'];
        config.content.policy = data['COOKIE.POLICY'];
        this.ccService.destroy();
        this.ccService.init(config);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
