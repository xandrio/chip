import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { StatusComponent } from './pages/status/status.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { langRedirectGuard } from './shared/guards/lang-redirect.guard';
import { LanguageDetectionComponent } from './shell/language-detection/language-detection.component';

export const routes: Routes = [
    {path: '',  canActivate: [langRedirectGuard], component: LanguageDetectionComponent },
    {
        path: ':lang',
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent, data: { scrollspy: true } },
            { path: 'status', component: StatusComponent },
            { path: 'login', component: LoginComponent },
            { path: 'admin', component: AdminComponent }
        ]
    },
    { path: '**', redirectTo: 'en', pathMatch: 'full' } // fallback
    
];
