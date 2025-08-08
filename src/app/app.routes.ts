import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DnsViewerComponent } from './components/dns-viewer/dns-viewer.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dns-viewer', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dns-viewer', 
    component: DnsViewerComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dns-viewer' }
];
