import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { TestimonialsService } from '../../../shared/services/testimonials.service';
import { TranslatePipe } from '@ngx-translate/core';

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

  constructor(
    private service: TestimonialsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.testimonials = this.service.getTestimonials();
    this.updateVisible();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateVisible();
  }

  private updateVisible() {
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      if (width < 640) {
        this.visible = 1;
      } else if (width < 1024) {
        this.visible = 2;
      } else if (width < 1280) {
        this.visible = 3;
      } else {
        this.visible = 4;
      }

      const max = this.testimonials.length - this.visible;
      if (this.index > max) {
        this.index = Math.max(max, 0);
      }
    }
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
