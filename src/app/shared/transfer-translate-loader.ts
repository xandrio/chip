import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TransferTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient, private transferState: TransferState) {}

  getTranslation(lang: string): Observable<any> {
    const key = makeStateKey<any>('transfer-translate-' + lang);
    const data = this.transferState.get(key, null);
    if (data) {
      return of(data);
    }
    return this.http.get<any>(`./i18n/${lang}.json`).pipe(
      tap(translation => this.transferState.set(key, translation))
    );
  }
}
