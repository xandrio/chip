import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-status',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true,
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent {
  private platformId = inject(PLATFORM_ID);
  statusForm: FormGroup;
  order: any = null;
  notFound = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.statusForm = this.fb.group({
      orderId: ['', Validators.required],
      pin: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('ngAfterViewInit called', this.route);
      this.route.fragment.subscribe((fragment) => {
        console.log('Fragment:', fragment);
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

}
