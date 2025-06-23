import { afterNextRender, Directive, ElementRef, Inject, Input, PLATFORM_ID, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ScrollSpyService } from '../services/scrollspy/scrollSpy.service';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  standalone: true,
  selector: '[appScrollSpy]',
})
export class ScrollspyDirective {
  @Input('appScrollSpy') id!: string;
  private observer!: IntersectionObserver;

  constructor(
    private el: ElementRef, 
    private spy: ScrollSpyService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // console.log('Element is in view:', this.id);
            this.spy.setActive(this.id);
          }
        },
        { threshold: 0.6 }
      );

      this.observer.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.observer?.disconnect();
    }
  }
}
