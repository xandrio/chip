import { Injectable } from '@angular/core';

export interface Testimonial {
  name: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {
  private testimonials: Testimonial[] = [
    { name: 'Juan Pérez', text: 'Excelente servicio, mi teléfono quedó como nuevo. ¡Gracias!' },
    { name: 'Marie Dubois', text: 'Service rapide et efficace. Je suis très satisfaite!' },
    { name: 'Hans Müller', text: 'Sehr professionell und freundlich. Immer wieder gern.' },
    { name: 'Лариса Иванова', text: 'Отличный мастер! Починили ноутбук за один день.' },
    { name: 'John Smith', text: 'Quick fix and fair price. Highly recommended!' },
    { name: 'Giuseppe Rossi', text: 'Professionali e veloci, il mio computer funziona perfettamente.' },
    { name: 'Carlos Pereira', text: 'Atendimento incrível. Voltarei sempre que precisar.' }
  ];

  getTestimonials(): Testimonial[] {
    return this.testimonials;
  }
}
