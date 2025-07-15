import { Component, Inject, PLATFORM_ID, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FaqComponent } from '../faq/faq.component';
import { ContactsComponent } from "../contacts/contacts.component";
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [ FaqComponent, ContactsComponent, NgbScrollSpyModule, ScrollspyDirective, TranslateModule],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {

cards = [
  {
    image: '/images/phone-repair-new.png',
    alt: 'HOME.SERVICE_CARD_PHONE',
    text: 'HOME.SERVICE_CARD_PHONE'
  },
  {
    image: '/images/laptop-repair-new.png',
    alt: 'HOME.SERVICE_CARD_LAPTOP',
    text: 'HOME.SERVICE_CARD_LAPTOP'
  },
  {
    image: '/images/data-recovery-new.png',
    alt: 'HOME.SERVICE_CARD_RECOVERY',
    text: 'HOME.SERVICE_CARD_RECOVERY'
  },
  {
    image: '/images/plug-replacement-new.png',
    alt: 'HOME.SERVICE_CARD_PLUG',
    text: 'HOME.SERVICE_CARD_PLUG'
  },
];

logos = [
  '/images/svg/apple.svg',
  '/images/svg/asus.svg',
  '/images/svg/huawei.svg',
  '/images/svg/oppo.svg',
  '/images/svg/samsung.svg',
  '/images/svg/xaomi.svg',
];

logosRow = [...this.logos, ...this.logos];

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {

  }

  private destroy$ = new Subject<void>();

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
        this.route.fragment.pipe(takeUntil(this.destroy$)).subscribe((fragment) => {
          if(fragment) {
            const container = document.getElementById('mainContent');
            const target = document.getElementById(fragment);

            if (container && target) {
              const top = target.offsetTop - 64; // учёт внутреннего отступа
              container.scrollTo({ top, behavior: 'smooth' });
            }
          }
        });

    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
