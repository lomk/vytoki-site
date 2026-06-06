import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { skip, switchMap, takeUntil } from 'rxjs/operators';

import { SectionApiService, BlogPost } from '../../section-api.service';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
  imports: [RouterLink],
})
export class BlogPostComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  post: BlogPost | null = null;
  loading = true;
  error = false;

  constructor(
    private api: SectionApiService,
    private route: ActivatedRoute,
    public i18n: I18nService,
    private titleSvc: Title,
    private meta: Meta,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(switchMap(p => { this.loading = true; return this.api.getBlogPost(p['slug']); }), takeUntil(this.destroy$))
      .subscribe({
        next: post => {
          this.post = post;
          this.loading = false;
          if (post.seo_title) this.titleSvc.setTitle(post.seo_title);
          if (post.seo_description) this.meta.updateTag({ name: 'description', content: post.seo_description });
          this.cdr.markForCheck();
        },
        error: () => { this.error = true; this.loading = false; this.cdr.markForCheck(); },
      });

    this.i18n.lang$.pipe(skip(1), takeUntil(this.destroy$)).subscribe(() => {
      const slug = this.route.snapshot.params['slug'];
      if (slug) this.api.getBlogPost(slug).subscribe({
        next: p => { this.post = p; this.cdr.markForCheck(); },
        error: () => {},
      });
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  t(key: string): string { return this.i18n.t(key); }

  formatDate(iso: string | null): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString(
      this.i18n.getLang() === 'en' ? 'en-GB' : 'uk-UA',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  }
}
