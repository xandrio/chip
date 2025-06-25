import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const langRedirectGuard: CanActivateFn = () => {
    // console.log('lang >>>>> >>>>>>> ############################################');
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  let lang = 'es';
  if (isPlatformBrowser(platformId)) {
    const htmlLang = document?.documentElement.lang;
    const saved = localStorage.getItem('lang');
    const browserLang = navigator.language?.split('-')[0];
    lang = saved || browserLang || htmlLang || 'es';
  } else {
    lang = (globalThis as any)?.document?.documentElement?.lang || 'es';
  }

  router.navigateByUrl(`/${lang}`);
  return false;
};
