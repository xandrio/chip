import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export const langRedirectGuard: CanActivateFn = () => {
    // console.log('lang >>>>> >>>>>>> ############################################');
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const doc = inject(DOCUMENT);

  let lang = 'es';
  if (isPlatformBrowser(platformId)) {
    const htmlLang = doc?.documentElement.lang;
    const saved = localStorage.getItem('lang');
    const browserLang = navigator.language?.split('-')[0];
    lang = saved || browserLang || htmlLang || 'es';
  } else {
    lang = doc?.documentElement.lang || 'es';
  }

  router.navigateByUrl(`/${lang}`);
  return false;
};
