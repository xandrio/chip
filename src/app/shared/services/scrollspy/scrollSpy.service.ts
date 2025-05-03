import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollSpyService {
  private active$ = new BehaviorSubject<string | null>(null);
  public activeSection$ = this.active$.asObservable();

  constructor() { }

  setActive(id: string) {
    this.active$.next(id);
  }

  clear() {
    this.active$.next(null);
  }
}
