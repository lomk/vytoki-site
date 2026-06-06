import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

import { SectionApiService, PageSection } from '../../section-api.service';
import { I18nService } from '../../i18n.service';
import { ModalService } from '../../modal.service';

@Component({
  selector: 'app-services-list',
  standalone: true,
  templateUrl: './services-list.html',
  styleUrl: './services-list.css',
  imports: [RouterLink, SlicePipe],
})
export class ServicesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  services: PageSection[] = [];
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
  }

  t(key: string): string { return this.i18n.t(key); }
  openConsultation(): void { this.modal.open(); }
}
