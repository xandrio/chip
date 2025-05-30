import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-faq',
  imports: [ NgbScrollSpyModule, ScrollspyDirective, TranslateModule ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  faqs: {question: string, answer: string}[] = [];
  openedIndex: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(private translate: TranslateService) {
      this.loadFaqs();

    // Подписка на смену языка
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadFaqs();
      });
  }

  loadFaqs() {
    this.faqs = [];
    this.faqs.push({
      question: this.translate.instant('FAQ.REPAIR_TIME_Q'),
      answer: this.translate.instant('FAQ.REPAIR_TIME_A')
    });
    this.faqs.push({
      question: this.translate.instant('FAQ.RECORD_Q'),
      answer: this.translate.instant('FAQ.RECORD_A')
    });
    this.faqs.push({
      question: this.translate.instant('FAQ.WARRANTY_Q'),
      answer: this.translate.instant('FAQ.WARRANTY_A')
    });
    this.faqs.push({
      question: this.translate.instant('FAQ.DIAGNOSTICS_Q'),
      answer: this.translate.instant('FAQ.DIAGNOSTICS_A')
    });
    this.faqs.push({
      question: this.translate.instant('FAQ.LEGAL_ENTITIES_Q'),
      answer: this.translate.instant('FAQ.LEGAL_ENTITIES_A')
    });
  }

  toggle(index: number) {
    this.openedIndex = this.openedIndex === index ? null : index;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
