import { Routes } from '@angular/router';

import { LoginComponent } from './modules/auth/components/login/login.component';
import { DashboardComponent } from './modules/dashboard/components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
