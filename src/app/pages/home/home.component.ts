import { afterNextRender, Component, Inject, PLATFORM_ID } from '@angular/core';
import { FaqComponent } from '../../shell/faq/faq.component';
import { ContactsComponent } from "../contacts/contacts.component";
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbScrollSpyModule, NgbScrollSpyService } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  imports: [FaqComponent, ContactsComponent, NgbScrollSpyModule],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(
    private route: ActivatedRoute, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private scroller: ViewportScroller,
    
  ) {
    

  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
        this.route.fragment.subscribe((fragment) => {
          if(fragment) {
            const container = document.getElementById('mainContent');
            const target = document.getElementById(fragment);
            
            if (container && target) {
              const top = target.offsetTop - 64; // учёт внутреннего отступа
              container.scrollTo({ top, behavior: 'smooth' });
            }
          }
        });
      
    } else {
      console.log('ngAfterViewInit called on server', this.route);
    }
    
  }
}
