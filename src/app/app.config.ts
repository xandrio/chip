import { ApplicationConfig, APP_INITIALIZER, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { TransferState } from '@angular/platform-browser';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { TransferTranslateLoader } from './shared/transfer-translate-loader';
import { DOCUMENT } from '@angular/common';

export function HttpLoaderFactory(http: HttpClient, transferState: TransferState) {
  return new TransferTranslateLoader(http, transferState);
}

export function initTranslate(translate: TranslateService, doc: Document) {
  return () => {
    const lang = doc.documentElement.lang || 'es';
    translate.setDefaultLang(lang);
    return firstValueFrom(translate.use(lang));
  };
}


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
        deps: [HttpClient, TransferState]
      }
    }).providers!,
    {
      provide: APP_INITIALIZER,
      useFactory: initTranslate,
      deps: [TranslateService, DOCUMENT],
      multi: true
    }
  ]
};
