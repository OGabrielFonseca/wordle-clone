import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'single',
    loadComponent: () => import('./pages/single/single.component').then(m => m.SingleComponent),
  },
];
