import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

import { SectionApiService, FaqItem } from '../../section-api.service';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  templateUrl: './faq.html',
  styleUrl: './faq.css',
  imports: [],
})
export class FaqComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  items: FaqItem[] = [];
  loading = true;
  openId: number | null = null;

  constructor(private api: SectionApiService, public i18n: I18nService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.i18n.lang$.pipe(skip(1), takeUntil(this.destroy$)).subscribe(() => this.load());
    this.load();
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private load(): void {
    this.loading = true;
    this.api.getFaq().subscribe({
      next: items => { this.items = items; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  t(key: string): string { return this.i18n.t(key); }
  toggle(id: number): void { this.openId = this.openId === id ? null : id; }
}
