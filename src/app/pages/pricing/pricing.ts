import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

import { SectionApiService, PricingPlan } from '../../section-api.service';
import { I18nService } from '../../i18n.service';
import { ModalService } from '../../modal.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
  imports: [],
})
export class PricingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  plans: PricingPlan[] = [];
  loading = true;

  constructor(
    private api: SectionApiService,
    public i18n: I18nService,
    private modal: ModalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
    this.i18n.lang$.pipe(skip(1), takeUntil(this.destroy$)).subscribe(() => this.load());
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private load(): void {
    this.loading = true;
    this.api.getPricing().subscribe({
      next: p => { this.plans = p; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  t(key: string): string { return this.i18n.t(key); }
  openConsultation(): void { this.modal.open(); }
}
