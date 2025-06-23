import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpBackend, HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import {
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import {
  TranslateHttpLoader
} from '@ngx-translate/http-loader';
import { NgcCookieConsentConfig, provideNgcCookieConsent } from 'ngx-cookieconsent';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

const cookieConfig: NgcCookieConsentConfig = {
  cookie: { domain: 'localhost' },
  palette: {
    popup: { background: '#000' },
    button: { background: '#f1d600' }
  },
  theme: 'edgeless',
  type: 'opt-in'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withPreloading(PreloadAllModules)), 
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideClientHydration(withEventReplay()),
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, HttpBackend]
      }
    }).providers!,
    provideNgcCookieConsent(cookieConfig)
  ]
};
