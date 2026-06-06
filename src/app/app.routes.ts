import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    title: 'Витоки — Архівний пошук та генеалогія в Україні',
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services-list/services-list').then(m => m.ServicesListComponent),
    title: 'Послуги — Витоки',
  },
  {
    path: 'services/:slug',
    loadComponent: () => import('./pages/service/service').then(m => m.ServiceComponent),
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing/pricing').then(m => m.PricingComponent),
    title: 'Ціни — Витоки',
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq').then(m => m.FaqComponent),
    title: 'Часті запитання — Витоки',
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog').then(m => m.BlogComponent),
    title: 'Блог — Витоки',
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/blog-post/blog-post').then(m => m.BlogPostComponent),
  },
  {
    path: 'contacts',
    loadComponent: () => import('./pages/contacts/contacts').then(m => m.ContactsComponent),
    title: 'Контакти — Витоки',
  },
  // Content pages served from Section API (about, social-program, privacy-policy, public-offer, etc.)
  {
    path: ':slug',
    loadComponent: () => import('./pages/section/section').then(m => m.SectionComponent),
  },
  { path: '**', redirectTo: '' },
];
