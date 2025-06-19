import { Routes } from '@angular/router';
import { langRedirectGuard } from './shared/guards/lang-redirect.guard';
import { LanguageDetectionComponent } from './shell/language-detection/language-detection.component';

export const routes: Routes = [
    {path: '',  canActivate: [langRedirectGuard], component: LanguageDetectionComponent },
    {
        path: ':lang',
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            {
                path: 'home',
                loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
                data: { scrollspy: true }
            },
            {
                path: 'status',
                loadComponent: () => import('./pages/status/status.component').then(m => m.StatusComponent)
            },
        ]
    },
    { path: '**', redirectTo: 'en', pathMatch: 'full' } // fallback
];
