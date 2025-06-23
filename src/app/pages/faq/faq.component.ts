import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-faq',
  imports: [ NgbScrollSpyModule, ScrollspyDirective, TranslatePipe ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
  standalone: true
})
export class FaqComponent {
  faqs: {question: string, answer: string}[] = [];
  openedIndex: number | null = null;
  private destroy$ = new Subject<void>();

  constructor() {
      this.loadFaqs();
  }

  loadFaqs() {
    this.faqs = [];
    this.faqs.push({
      question: 'FAQ.REPAIR_TIME_Q',
      answer: 'FAQ.REPAIR_TIME_A'
    });
    this.faqs.push({
      question: 'FAQ.RECORD_Q',
      answer: 'FAQ.RECORD_A'
    });
    this.faqs.push({
      question: 'FAQ.WARRANTY_Q',
      answer: 'FAQ.WARRANTY_A'
    });
    this.faqs.push({
      question: 'FAQ.DIAGNOSTICS_Q',
      answer: 'FAQ.DIAGNOSTICS_A'
    });
    this.faqs.push({
      question: 'FAQ.LEGAL_ENTITIES_Q',
      answer: 'FAQ.LEGAL_ENTITIES_A'
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
