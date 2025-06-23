import { isPlatformBrowser, UpperCasePipe } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-language-selection',
  imports: [ UpperCasePipe ],
  templateUrl: './language-selection.component.html',
  styleUrl: './language-selection.component.scss'
})
export class LanguageSelectionComponent implements OnDestroy {
  open = false;
  currentLang: string = 'es'; // Default language

  private destroy$ = new Subject<void>();

  languages = [
    { code: 'es', label: 'Español' },
    { code: 'vl', label: 'Valenciano' },
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'ua', label: 'Українська' },
  ];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((event) => {
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
      // console.log('Saving language to localStorage:', lang);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
