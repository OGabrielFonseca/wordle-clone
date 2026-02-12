import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'single',
    pathMatch: 'full',
  },
  {
    path: 'single',
    loadComponent: () => import('./pages/single/single.component').then(m => m.SingleComponent),
  },
];
