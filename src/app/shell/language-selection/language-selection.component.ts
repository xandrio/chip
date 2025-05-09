import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selection',
  imports: [],
  templateUrl: './language-selection.component.html',
  styleUrl: './language-selection.component.scss'
})
export class LanguageSelectionComponent {
  open = false;
  currentLang: string = 'en'; // Default language

  languages = [
    { code: 'es', label: 'Español', flag: 'https://flagcdn.com/es.svg' },
    { code: 'vl', label: 'Valenciano', flag: '/flags/valencia.png' },
    { code: 'en', label: 'English', flag: 'https://flagcdn.com/gb.svg' },
    { code: 'ru', label: 'Русский', flag: 'https://flagcdn.com/ru.svg' },
    { code: 'uk', label: 'Українська', flag: 'https://flagcdn.com/ua.svg' },
  ];

  constructor(private translate: TranslateService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
  }

  changeLang(lang: string) {
      this.translate.use(lang);
      // this.currentLang = lang;
    
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('lang', lang); // ✅ сохраняем язык
      }
    
      const currentUrl = this.router.url;
      const cleaned = currentUrl.replace(/^\/[a-z]{2}/, '');
      this.open = false;
      this.router.navigate([`/${lang}${cleaned}`]);
  }

  getLabel(code: string): string {
    return this.languages.find(lang => lang.code === code)?.label || '';
  }

  getFlag(code: string): string {
    return this.languages.find(lang => lang.code === code)?.flag || '';
  }
}
