import { afterNextRender, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[appScrollSpy]',
})
export class ScrollspyDirective {
  @Input('appScrollSpy') appScrollSpy: string | null = null;
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2, private router: Router) {}

  ngOnInit(): void {
    this.observeTarget();

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const hash = event.urlAfterRedirects.split('#')[1];
        
        // Если фрагмент есть и соответствует — всё ок
        if (hash === this.appScrollSpy) return;

        // Иначе снимаем активность
        this.removeActiveClasses();

        // При переходе на ту же страницу — обновляем Observer
        const target = document.getElementById(this.appScrollSpy!);
        if (target && this.observer) {
          this.observer.disconnect();
          this.observeTarget();
        }
      });
  }

  observeTarget(): void {
    const target = document.getElementById(this.appScrollSpy!);
    if (!target) return;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(this.el.nativeElement, 'bg-sky-900');
          this.renderer.addClass(this.el.nativeElement, 'text-white');
        } else {
          this.removeActiveClasses();
        }
      },
      { threshold: 0.6 }
    );

    this.observer.observe(target);
  }

  removeActiveClasses() {
    this.renderer.removeClass(this.el.nativeElement, 'bg-sky-900');
    this.renderer.removeClass(this.el.nativeElement, 'text-white');
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.removeActiveClasses();
  }
}
