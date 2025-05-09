import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-faq',
  imports: [ NgbScrollSpyModule, ScrollspyDirective, TranslateModule ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  faqs: {question: string, answer: string}[] = [];
  openedIndex: number | null = null;

  constructor(private translate: TranslateService) {
    this.faqs.push({
      question: this.translate.instant('FAQ.REPAIR_TIME_Q'), //'Сколько времени занимает ремонт телефона?',
      answer: this.translate.instant('FAQ.REPAIR_TIME_A') //'Простые работы, такие как замена батареи или экрана, выполняются в течение 1–2 часов. Более сложные случаи — от 1 до 3 дней.'
    });
    this.faqs.push({
      question: this.translate.instant('FAQ.RECORD_Q'), //'Нужно ли записываться заранее?',
      answer: this.translate.instant('FAQ.RECORD_A') //'Не обязательно — мы принимаем и без записи. Но если вы хотите быть обслужены без ожидания, рекомендуем позвонить заранее.'3 дней.'
    });
    this.faqs.push({
      question: this.translate.instant('FAQ.WARRANTY_Q'), //'Даете ли вы гарантию на ремонт?',
      answer: this.translate.instant('FAQ.WARRANTY_A') //'Да, на все виды ремонта предоставляется гарантия от 1 до 6 месяцев, в зависимости от типа услуги.'
    });
    this.faqs.push({
      question: this.translate.instant('FAQ.DIAGNOSTICS_Q'), //'Сколько стоит диагностика?',
      answer: this.translate.instant('FAQ.DIAGNOSTICS_A') //'Диагностика — бесплатная, даже если вы решите не ремонтировать устройство у нас.'
    });
    this.faqs.push({
      question: this.translate.instant('FAQ.LEGAL_ENTITIES_Q'), //'Вы работаете с юридическими лицами?',
      answer: this.translate.instant('FAQ.LEGAL_ENTITIES_A') //'Да, мы обслуживаем как частных клиентов, так и компании. Предоставляем акты выполненных работ и закрывающие документы.'
    });
  }




  toggle(index: number) {
    this.openedIndex = this.openedIndex === index ? null : index;
  }
}
