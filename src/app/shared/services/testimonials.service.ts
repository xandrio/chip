import { Injectable } from '@angular/core';

export interface Testimonial {
  name: string;
  image?: string; // Optional image URL for testimonials with images
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {
private testimonials: Testimonial[] = [
  // Туристы
  {
    name: 'Emily Thompson (UK)',
    image: 'images/feedback/vi.jpg',
    text: 'My phone died mid-vacation. These guys fixed it the same day — absolute lifesavers!'
  },
  {
    name: 'Антон Громов (Украина)',
    image: 'images/feedback/xok.jpg',
    text: 'Во время отпуска в Валенсии сломался ноут. Всё починили за сутки и даже объяснили, как продлить срок службы. Очень выручили!'
  },

  // Местные жители
  {
    name: 'Juan Pérez',
    image: 'images/feedback/arti.jpg',
    text: 'Excelente servicio. Me devolvieron el móvil como nuevo en solo unas horas. ¡Muy recomendables!'
  },
  {
    name: 'Catherine Martin',
    image: 'images/feedback/ki.jpg',
    text: 'Service rapide et soigné. Le personnel est très gentil et à l’écoute. Merci beaucoup !'
  },
  {
    name: 'Hans Müller',
    text: 'Schnell, professionell und zuverlässig. Bin rundum zufrieden.'
  },
  {
    name: 'Лариса Иванова',
    text: 'Мастер на высоте! Починили ноутбук за один день. Теперь работает даже лучше, чем раньше.'
  },
  {
    name: 'Carlos Pereira',
    text: 'Atendimento excelente. Resolvido tudo rápido e com muita clareza. Recomendo!'
  },

  // Бизнес-клиенты
  {
    name: 'John Smith – IT Consultant',
    text: 'Had a charging issue on my work phone. They fixed it the same day, no fuss, no delays. Perfect for busy professionals.'
  },
  {
    name: 'Giuseppe Rossi – Studio Legale',
    text: 'Servizio efficiente e cortese. Abbiamo affidato più dispositivi e ogni volta il lavoro è stato impeccabile. Un vero alleato per chi lavora con la tecnologia.'
  },
  {
    name: 'Sofía Martín – Diseñadora gráfica',
    text: 'Mi portátil tenía un fallo en la pantalla y lo arreglaron en 48 horas. ¡Muy profesionales y con trato cercano!'
  }
];



  getTestimonials(): Testimonial[] {
    return this.testimonials;
  }
}
