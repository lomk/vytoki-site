import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ServiceImage {
  id: number;
  image: string;   // /media/...
  alt: string;
  sort: number;
}

export interface ServiceArticleImage {
  id: number;
  image: string;   // /media/...
  alt: string;
  sort: number;
}

export interface ServiceArticle {
  id: number;
  title: string;
  subtitle: string;
  text: string;
  sort: number;
  updated_at: string;
  images: ServiceArticleImage[];
}

export interface Service {
  slug: string;
  title: string;
  subtitle: string;
  body: string;
  seo_title: string;
  seo_description: string;
  updated_at: string;
  images: ServiceImage[];
  articles: ServiceArticle[];
}

@Injectable({ providedIn: 'root' })
export class ServiceApiService {
  constructor(private http: HttpClient) {}

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`/api/services/`);
  }

  getService(slug: string): Observable<Service> {
    return this.http.get<Service>(`/api/services/${slug}/`);
  }
}
