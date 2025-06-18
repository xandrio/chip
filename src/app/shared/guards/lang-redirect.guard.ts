import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const langRedirectGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  let lang = 'en';

  if (isPlatformBrowser(platformId)) {
    const saved = localStorage.getItem('lang');
    const browserLang = navigator.language?.split('-')[0];
    lang = saved || browserLang || 'en';
  }

  router.navigateByUrl(`/${lang}`);
  return false;
};
