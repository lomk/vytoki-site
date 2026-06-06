import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { skip, switchMap, takeUntil } from 'rxjs/operators';

import { SectionApiService, PageSection } from '../../section-api.service';
import { I18nService } from '../../i18n.service';
import { ModalService } from '../../modal.service';

@Component({
  selector: 'app-service',
  standalone: true,
  templateUrl: './service.html',
  styleUrl: './service.css',
  imports: [RouterLink],
})
export class ServiceComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  service: PageSection | null = null;
  loading = true;
  error = false;
  activeArticle: number | null = null;

  constructor(
    private api: SectionApiService,
    private route: ActivatedRoute,
    public i18n: I18nService,
    private titleSvc: Title,
    private meta: Meta,
    private modal: ModalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => {
          this.loading = true;
          this.error = false;
          this.service = null;
          return this.api.getService(params['slug']);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: data => {
          this.service = data;
          this.loading = false;
          if (data.seo_title) this.titleSvc.setTitle(data.seo_title);
          if (data.seo_description) this.meta.updateTag({ name: 'description', content: data.seo_description });
          this.cdr.markForCheck();
        },
        error: () => { this.error = true; this.loading = false; this.cdr.markForCheck(); },
      });

    this.i18n.lang$.pipe(skip(1), takeUntil(this.destroy$)).subscribe(() => {
      const slug = this.route.snapshot.params['slug'];
      if (slug) this.api.getService(slug).subscribe({
        next: d => { this.service = d; this.cdr.markForCheck(); },
        error: () => {},
      });
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  t(key: string): string { return this.i18n.t(key); }
  openConsultation(): void { this.modal.open(); }
  toggleArticle(id: number): void { this.activeArticle = this.activeArticle === id ? null : id; }
}
