import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
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
  currentLang: string = 'es'; // Default language

  languages = [
    { code: 'es', label: 'Español', flag: 'https://flagcdn.com/es.svg' },
    { code: 'vl', label: 'Valenciano', flag: '/flags/valencia.png' },
    { code: 'en', label: 'English', flag: 'https://flagcdn.com/gb.svg' },
    { code: 'ru', label: 'Русский', flag: 'https://flagcdn.com/ru.svg' },
    { code: 'ua', label: 'Українська', flag: 'https://flagcdn.com/ua.svg' },
  ];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
  }

  toggle(): void {
    this.open = !this.open;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open && !this.el.nativeElement.contains(event.target as Node)) {
      this.open = false;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(): void {
    if (this.open) {
      this.open = false;
    }
  }

  changeLang(lang: string) {
    this.translate.use(lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage?.setItem('lang', lang); // ✅ сохраняем язык
    }

    const tree = this.router.parseUrl(this.router.url);
    const segments = tree.root.children['primary']?.segments ?? [];
    const pathSegments = segments.slice(1).map(s => s.path); // remove current lang

    this.open = false;
    this.router.navigate(['/', lang, ...pathSegments], {
      fragment: tree.fragment ?? undefined
    });
  }

  getLabel(code: string): string {
    return this.languages.find(lang => lang.code === code)?.label || '';
  }

  getFlag(code: string): string {
    return this.languages.find(lang => lang.code === code)?.flag || '';
  }
}
