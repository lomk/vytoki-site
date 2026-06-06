import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

import { SectionApiService, BlogPostSummary } from '../../section-api.service';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  templateUrl: './blog.html',
  styleUrl: './blog.css',
  imports: [RouterLink],
})
export class BlogComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  posts: BlogPostSummary[] = [];
  loading = true;

  constructor(private api: SectionApiService, public i18n: I18nService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.i18n.lang$.pipe(skip(1), takeUntil(this.destroy$)).subscribe(() => this.load());
    this.load();
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private load(): void {
    this.loading = true;
    this.api.getBlogPosts().subscribe({
      next: p => { this.posts = p; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  t(key: string): string { return this.i18n.t(key); }

  formatDate(iso: string | null): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString(
      this.i18n.getLang() === 'en' ? 'en-GB' : 'uk-UA',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  }
}
