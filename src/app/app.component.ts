import { Component, Inject, DOCUMENT, OnDestroy } from '@angular/core';
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
export class AppComponent implements OnDestroy {
  title = 'chip';
  private destroy$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private ccService: NgcCookieConsentService
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
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
