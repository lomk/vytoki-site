/**
 * Legacy NgModule routing file — kept for reference only.
 * The active router configuration is src/app/app.routes.ts,
 * loaded via provideRouter() in src/app/app.config.ts.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./src/app/pages/home/home').then(m => m.HomeComponent),
    title: 'Витоки — Архівний пошук та генеалогія в Україні',
  },
  {
    path: 'services',
    loadComponent: () => import('./src/app/pages/services-list/services-list').then(m => m.ServicesListComponent),
    title: 'Послуги — Витоки',
  },
  {
    path: 'services/:slug',
    loadComponent: () => import('./src/app/pages/service/service').then(m => m.ServiceComponent),
  },
  {
    path: 'pricing',
    loadComponent: () => import('./src/app/pages/pricing/pricing').then(m => m.PricingComponent),
    title: 'Ціни — Витоки',
  },
  {
    path: 'faq',
    loadComponent: () => import('./src/app/pages/faq/faq').then(m => m.FaqComponent),
    title: 'Часті запитання — Витоки',
  },
  {
    path: 'blog',
    loadComponent: () => import('./src/app/pages/blog/blog').then(m => m.BlogComponent),
    title: 'Блог — Витоки',
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./src/app/pages/blog-post/blog-post').then(m => m.BlogPostComponent),
  },
  {
    path: 'contacts',
    loadComponent: () => import('./src/app/pages/contacts/contacts').then(m => m.ContactsComponent),
    title: 'Контакти — Витоки',
  },
  // Content pages (About, Social Program, Privacy Policy, Public Offer)
  // all served by SectionComponent which fetches the matching Section from the API
  {
    path: ':slug',
    loadComponent: () => import('./src/app/pages/section/section').then(m => m.SectionComponent),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
