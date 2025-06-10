import { Component, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shell/navigation/navigation.component';
import { FooterComponent } from './shell/footer/footer.component';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, NavigationComponent, FooterComponent, NgbScrollSpyModule ],
  providers: [TranslateService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chip';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const lang = this.route.snapshot.firstChild?.paramMap.get('lang') ?? 'en';
      this.translate.use(lang);
    });

    this.translate.onLangChange.subscribe(e => {
      this.document.documentElement.lang = e.lang;
    });
  }
}
