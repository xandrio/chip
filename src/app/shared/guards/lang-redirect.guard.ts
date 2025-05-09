import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const langRedirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const saved = localStorage?.getItem('lang');
  const browserLang = navigator.language?.split('-')[0];
  const lang = saved || browserLang || 'en';
  router.navigateByUrl(`/${lang}`);
  return false;
};
