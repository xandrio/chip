import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { SUPPORTED_LANGUAGES, LangCode } from '../languages';

export const langRedirectGuard: CanActivateFn = () => {
    // console.log('lang >>>>> >>>>>>> ############################################');
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const doc = inject(DOCUMENT);

  let lang: LangCode = 'es';
  if (isPlatformBrowser(platformId)) {
    const htmlLang = doc?.documentElement.lang;
    const saved = localStorage.getItem('lang');
    const browserLang = navigator.language?.split('-')[0];

    const candidate = [saved, browserLang, htmlLang].find(l =>
      l && SUPPORTED_LANGUAGES.includes(l as LangCode)
    );
    lang = (candidate as LangCode) || 'es';
  } else {
    const htmlLang = doc?.documentElement.lang;
    if (htmlLang && SUPPORTED_LANGUAGES.includes(htmlLang as LangCode)) {
      lang = htmlLang as LangCode;
    }
  }

  router.navigateByUrl(`/${lang}`);
  return false;
};
