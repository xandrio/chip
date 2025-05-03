import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { StatusComponent } from './pages/status/status.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, data: { scrollspy: true } },
    { path: 'contacts', component: ContactsComponent },
    { path: 'status', component: StatusComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent }
];
