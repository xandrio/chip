import { Component, Inject, PLATFORM_ID, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FaqComponent } from '../faq/faq.component';
import { ContactsComponent } from "../contacts/contacts.component";
import { FeedbackCarouselComponent } from './feedback-carousel/feedback-carousel.component';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [ FaqComponent, ContactsComponent, NgbScrollSpyModule, ScrollspyDirective, TranslateModule, FeedbackCarouselComponent, RouterLink ],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  public currentLang = 'es';

cards = [
  {
    image: '/images/phone-repair-new.jpg',
    alt: 'HOME.SERVICE_CARD_PHONE',
    text: 'HOME.SERVICE_CARD_PHONE'
  },
  {
    image: '/images/laptop-repair-new.jpg',
    alt: 'HOME.SERVICE_CARD_LAPTOP',
    text: 'HOME.SERVICE_CARD_LAPTOP'
  },
  {
    image: '/images/data-recovery-new.jpg',
    alt: 'HOME.SERVICE_CARD_RECOVERY',
    text: 'HOME.SERVICE_CARD_RECOVERY'
  },
  {
    image: '/images/plug-replacement-new.jpg',
    alt: 'HOME.SERVICE_CARD_PLUG',
    text: 'HOME.SERVICE_CARD_PLUG'
  },
];

logos = [
  '/images/svg/huawei.svg',
  '/images/svg/asus.svg',
  '/images/svg/apple.svg',
  '/images/svg/samsung.svg',
  '/images/svg/xaomi.svg',
  '/images/svg/oppo.svg',
];

  logosRow = [...this.logos];

  steps = [
    {
      image: '/images/request.png',
      number: '1',
      text: 'HOME.STEPS_REQUEST'
    },
    {
      image: '/images/diagnostics.png',
      number: '2',
      text: 'HOME.STEPS_DIAGNOSTICS'
    },
    {
      image: '/images/repair.png',
      number: '3',
      text: 'HOME.STEPS_REPAIR'
    },
    {
      image: '/images/finish.png',
      number: '4',
      text: 'HOME.STEPS_FINISH'
    },
  ];

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
  ) {
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe(e => {
      this.currentLang = e.lang;
    });
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

  public getRouterLink(section: string): string {
    if (section === 'status') {
      return `/${this.currentLang}/status`;
    }
    return `/${this.currentLang}/home`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
