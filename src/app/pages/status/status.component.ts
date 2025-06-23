import { Component, Inject, PLATFORM_ID, OnDestroy, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-status',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true,
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent implements AfterViewInit, OnDestroy {
  statusForm: FormGroup;
  order: any = null;
  notFound = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private scroller: ViewportScroller
  ) {
    this.statusForm = this.fb.group({
      orderId: ['', Validators.required],
      pin: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  private destroy$ = new Subject<void>();

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {

        this.route.fragment.pipe(takeUntil(this.destroy$)).subscribe((fragment) => {
          // console.log('Fragment:', fragment);
          if(fragment) {
            const container = document.getElementById('mainContent');
            const target = document.getElementById(fragment);
            
            if (container && target) {
              const top = target.offsetTop - 64; // учёт внутреннего отступа
              container.scrollTo({ top, behavior: 'smooth' });
            }
          }
        });

    }

  }

  checkStatus() {
    const { orderId, pin } = this.statusForm.value;

    // Заглушка
    if (orderId === '123456' && pin === '1111') {
      this.order = {
        id: '123456',
        device: 'iPhone 13 Pro',
        status: 'В ремонте',
        date: '2025-04-20'
      };
      this.notFound = false;
    } else {
      this.order = null;
      this.notFound = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
