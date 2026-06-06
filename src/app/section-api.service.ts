import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { I18nService } from './i18n.service';

export interface ServiceImage {
  id: number;
  image: string;
  alt: string;
  sort: number;
}

export interface Article {
  id: number;
  title: string;
  subtitle: string;
  text: string;
  seo_title: string;
  seo_description: string;
  sort: number;
  updated_at: string;
  images: ServiceImage[];
}

export interface PageSection {
  slug: string;
  title: string;
  subtitle: string;
  body: string;
  seo_title: string;
  seo_description: string;
  updated_at: string;
  images: ServiceImage[];
  articles: Article[];
}

export interface Contact {
  title: string;
  text: string;
  address: string;
  phone1: string;
  phone2: string;
  phone3: string;
  email: string;
  telegram: string;
  viber: string;
  whatsapp: string;
  updated_at: string;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  subtitle: string;
  seo_description: string;
  cover_image: string | null;
  published_at: string | null;
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  body: string;
  seo_title: string;
  seo_description: string;
  cover_image: string | null;
  published_at: string | null;
  updated_at: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  sort: number;
}

export interface PricingPlan {
  slug: string;
  name: string;
  description: string;
  features: string[];
  price_display: string;
  is_featured: boolean;
  sort: number;
}

export interface ConsultationPayload {
  name: string;
  email?: string;
  phone?: string;
  contact_method?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class SectionApiService {
  constructor(
    private http: HttpClient,
    private i18n: I18nService,
  ) {}

  private lang(): string {
    return this.i18n.getLang();
  }

  // ─── Services ──────────────────────────────────────────────────────────────
  getServices(): Observable<PageSection[]> {
    return this.http.get<PageSection[]>(`/api/services/?lang=${this.lang()}`);
  }

  getService(slug: string): Observable<PageSection> {
    return this.http.get<PageSection>(`/api/services/${slug}/?lang=${this.lang()}`);
  }

  getServiceArticles(slug: string): Observable<Article[]> {
    return this.http.get<Article[]>(`/api/services/${slug}/articles/?lang=${this.lang()}`);
  }

  getServiceArticle(serviceSlug: string, articleId: number): Observable<Article> {
    return this.http.get<Article>(
      `/api/services/${serviceSlug}/articles/${articleId}/?lang=${this.lang()}`
    );
  }

  // ─── Sections ──────────────────────────────────────────────────────────────
  getSections(): Observable<PageSection[]> {
    return this.http.get<PageSection[]>(`/api/sections/?lang=${this.lang()}`);
  }

  getSection(slug: string): Observable<PageSection> {
    return this.http.get<PageSection>(`/api/sections/${slug}/?lang=${this.lang()}`);
  }

  getSectionArticles(slug: string): Observable<Article[]> {
    return this.http.get<Article[]>(`/api/sections/${slug}/articles/?lang=${this.lang()}`);
  }

  getSectionArticle(sectionSlug: string, articleId: number): Observable<Article> {
    return this.http.get<Article>(
      `/api/sections/${sectionSlug}/articles/${articleId}/?lang=${this.lang()}`
    );
  }

  // ─── Contacts ──────────────────────────────────────────────────────────────
  getContacts(): Observable<Contact> {
    return this.http.get<Contact>(`/api/contacts/?lang=${this.lang()}`);
  }

  // ─── Blog ──────────────────────────────────────────────────────────────────
  getBlogPosts(): Observable<BlogPostSummary[]> {
    return this.http.get<BlogPostSummary[]>(`/api/blog/?lang=${this.lang()}`);
  }

  getBlogPost(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`/api/blog/${slug}/?lang=${this.lang()}`);
  }

  // ─── FAQ ───────────────────────────────────────────────────────────────────
  getFaq(): Observable<FaqItem[]> {
    return this.http.get<FaqItem[]>(`/api/faq/?lang=${this.lang()}`);
  }

  // ─── Pricing ───────────────────────────────────────────────────────────────
  getPricing(): Observable<PricingPlan[]> {
    return this.http.get<PricingPlan[]>(`/api/pricing/?lang=${this.lang()}`);
  }

  // ─── Consultation ──────────────────────────────────────────────────────────
  createConsultation(payload: ConsultationPayload): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>('/api/consultations/', payload);
  }

  // ─── Language (kept for backward compatibility) ────────────────────────────
  setLanguage(lang: string): void {
    this.i18n.setLang(lang);
  }
}
