import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'brand-ui gallery',
    loadComponent: () =>
      import('./gallery/gallery-page.component').then((module) => module.GalleryPage),
  },
];
