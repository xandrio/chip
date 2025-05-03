import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';

@Component({
  selector: 'app-faq',
  imports: [ NgbScrollSpyModule, ScrollspyDirective ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  openedIndex: number | null = null;

  faqs = [
    {
      question: 'Сколько времени занимает ремонт телефона?',
      answer: 'Простые работы, такие как замена батареи или экрана, выполняются в течение 1–2 часов. Более сложные случаи — от 1 до 3 дней.'
    },
    {
      question: 'Нужно ли записываться заранее?',
      answer: 'Не обязательно — мы принимаем и без записи. Но если вы хотите быть обслужены без ожидания, рекомендуем позвонить заранее.'
    },
    {
      question: 'Даете ли вы гарантию на ремонт?',
      answer: 'Да, на все виды ремонта предоставляется гарантия от 1 до 6 месяцев, в зависимости от типа услуги.'
    },
    {
      question: 'Сколько стоит диагностика?',
      answer: 'Диагностика — бесплатная, даже если вы решите не ремонтировать устройство у нас.'
    },
    {
      question: 'Вы работаете с юридическими лицами?',
      answer: 'Да, мы обслуживаем как частных клиентов, так и компании. Предоставляем акты выполненных работ и закрывающие документы.'
    }
  ];

  toggle(index: number) {
    this.openedIndex = this.openedIndex === index ? null : index;
  }
}
