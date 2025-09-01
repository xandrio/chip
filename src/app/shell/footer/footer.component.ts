import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ RouterLink, TranslateModule ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  public currentLang = 'es';

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe(e => {
      this.currentLang = e.lang;
    });
  }

  public getRouterLink(section: string): string {
    if (section === 'status') {
      return `/${this.currentLang}/status`;
    }
    return `/${this.currentLang}/home`;
  }
}
