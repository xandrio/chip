import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TestimonialsService } from '../../../shared/services/testimonials.service';

@Component({
  selector: 'app-feedback-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback-carousel.component.html',
  styleUrl: './feedback-carousel.component.scss'
})
export class FeedbackCarouselComponent {
  testimonials = [] as ReturnType<TestimonialsService['getTestimonials']>;
  index = 0;
  visible = 4;

  constructor(private service: TestimonialsService) {
    this.testimonials = this.service.getTestimonials();
  }

  next() {
    const max = this.testimonials.length - this.visible;
    this.index = this.index >= max ? 0 : this.index + 1;
  }

  prev() {
    const max = this.testimonials.length - this.visible;
    this.index = this.index === 0 ? max : this.index - 1;
  }
}
