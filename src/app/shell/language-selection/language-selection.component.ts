import { Component } from '@angular/core';

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
    { code: 'en', label: 'English', flag: 'https://flagcdn.com/gb.svg' },
    { code: 'ru', label: 'Русский', flag: 'https://flagcdn.com/ru.svg' },
    { code: 'uk', label: 'Українська', flag: 'https://flagcdn.com/ua.svg' }
  ];

  constructor() {
    // this.currentLang = this.translate.currentLang || this.translate.getDefaultLang();
  }

  changeLang(lang: string) {
    // this.translate.use(lang);
    this.currentLang = lang;
    this.open = false;
  }

  getLabel(code: string): string {
    return this.languages.find(lang => lang.code === code)?.label || '';
  }

  getFlag(code: string): string {
    return this.languages.find(lang => lang.code === code)?.flag || '';
  }
}
