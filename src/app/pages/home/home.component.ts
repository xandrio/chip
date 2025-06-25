import { Component, Inject, PLATFORM_ID, OnDestroy, AfterViewInit, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
// Lazy loaded components are imported dynamically to keep the main bundle small
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [ NgbScrollSpyModule, ScrollspyDirective, TranslateModule ],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;
  // Containers for lazy-loaded components
  @ViewChild('contactsContainer', { read: ViewContainerRef }) contactsContainer?: ViewContainerRef;
  @ViewChild('faqContainer', { read: ViewContainerRef }) faqContainer?: ViewContainerRef;

  private playListener?: () => void;

cards = [
  {
    image: '/images/mob-r.jpg',
    alt: 'HOME.PHONE_REP_TITLE',
    title: 'HOME.PHONE_REP_TITLE',
    desc: 'HOME.PHONE_REP_DESC'
  },
  {
    image: '/images/lap-r.jpg',
    alt: 'HOME.LAPTOP_REP_TITLE',
    title: 'HOME.LAPTOP_REP_TITLE',
    desc: 'HOME.LAPTOP_REP_DESC'
  },
  {
    image: '/images/clean.jpg',
    alt: 'HOME.LAPTOP_CLEAN_TITLE',
    title: 'HOME.LAPTOP_CLEAN_TITLE',
    desc: 'HOME.LAPTOP_CLEAN_DESC'
  },
  {
    image: '/images/win-i.jpg',
    alt: 'HOME.WIN_INSTALL_TITLE',
    title: 'HOME.WIN_INSTALL_TITLE',
    desc: 'HOME.WIN_INSTALL_DESC'
  },
  {
    image: '/images/soft-i.jpg',
    alt: 'HOME.APP_INSTALL_TITLE',
    title: 'HOME.APP_INSTALL_TITLE',
    desc: 'HOME.APP_INSTALL_DESC'
  },
  {
    image: '/images/pc-d.jpg',
    alt: 'HOME.DIAG_TITLE',
    title: 'HOME.DIAG_TITLE',
    desc: 'HOME.DIAG_DESC'
  },
];

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {

  }

  private destroy$ = new Subject<void>();

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
        const videoEl = this.heroVideo?.nativeElement;
        this.playListener = () => videoEl?.play().catch(() => {});
        if (videoEl) {
          videoEl.addEventListener('canplay', this.playListener);
          setTimeout(this.playListener);
        }
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

        // Lazy load heavy components after the main content is ready
        import('../contacts/contacts.component').then(m => {
          this.contactsContainer?.createComponent(m.ContactsComponent);
        });
        import('../faq/faq.component').then(m => {
          this.faqContainer?.createComponent(m.FaqComponent);
        });

    }

  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      const videoEl = this.heroVideo?.nativeElement;
      if (videoEl && this.playListener) {
        videoEl.removeEventListener('canplay', this.playListener);
      }
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
