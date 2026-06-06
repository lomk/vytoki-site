import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

import { SectionApiService, PageSection, BlogPostSummary } from '../../section-api.service';
import { I18nService } from '../../i18n.service';
import { ModalService } from '../../modal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [RouterLink],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  services: PageSection[] = [];
  recentPosts: BlogPostSummary[] = [];
  loading = true;

  constructor(
    private api: SectionApiService,
    public i18n: I18nService,
    private modal: ModalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.i18n.lang$.pipe(skip(1), takeUntil(this.destroy$)).subscribe(() => this.load());
    this.load();
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private load(): void {
    this.loading = true;
    this.api.getServices().subscribe({
      next: s => { this.services = s; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
    this.api.getBlogPosts().subscribe({ next: p => (this.recentPosts = p.slice(0, 3)), error: () => {} });
  }

  t(key: string): string { return this.i18n.t(key); }
  openConsultation(): void { this.modal.open(); }

  formatDate(iso: string | null): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString(
      this.i18n.getLang() === 'en' ? 'en-GB' : 'uk-UA',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  }

  readonly whyItems = [1, 2, 3, 4] as const;

  readonly serviceIcons = [
    `<path d="M9 12h6M9 16h4M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.8" fill="none"/>`,
    `<circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    `<path d="M12 3v5M9 8H6a2 2 0 0 0-2 2v2M18 8h-3M6 12v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  ];
}
