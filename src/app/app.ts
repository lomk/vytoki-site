import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { SectionApiService, PageSection } from './section-api.service';
import { I18nService } from './i18n.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule],
})
export class App implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentYear = new Date().getFullYear();
  services: PageSection[] = [];
  menuOpen = false;
  servicesDropdownOpen = false;
  showModal = false;
  formState: 'idle' | 'sending' | 'success' | 'error' = 'idle';
  contactMethods = ['phone', 'email', 'telegram', 'viber', 'whatsapp'];

  consultForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
    contact_method: new FormControl('phone', { nonNullable: true }),
    message: new FormControl('', { nonNullable: true }),
  });

  constructor(
    public i18n: I18nService,
    private api: SectionApiService,
    private router: Router,
    private modalSvc: ModalService,
  ) {}

  ngOnInit(): void {
    this.loadServices();

    this.i18n.lang$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadServices();
    });

    this.modalSvc.open$.pipe(takeUntil(this.destroy$)).subscribe(() => this.openModal());

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe(() => {
        this.menuOpen = false;
        this.servicesDropdownOpen = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadServices(): void {
    this.api.getServices().subscribe({ next: s => (this.services = s), error: () => {} });
  }

  t(key: string): string {
    return this.i18n.t(key);
  }

  get lang(): string {
    return this.i18n.getLang();
  }

  setLang(lang: string): void {
    this.i18n.setLang(lang);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleServicesDropdown(event: Event): void {
    event.preventDefault();
    this.servicesDropdownOpen = !this.servicesDropdownOpen;
  }

  closeNav(): void {
    this.menuOpen = false;
    this.servicesDropdownOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.servicesDropdownOpen = false;
    if (this.showModal) this.closeModal();
  }

  // ─── Consultation modal ─────────────────────────────────────────────────────

  openModal(): void {
    this.showModal = true;
    this.formState = 'idle';
    this.consultForm.reset();
    this.consultForm.patchValue({ contact_method: 'phone' });
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.showModal = false;
    document.body.style.overflow = '';
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('vt-modal-overlay')) {
      this.closeModal();
    }
  }

  submitConsultation(): void {
    if (this.consultForm.invalid || this.formState === 'sending') return;
    this.formState = 'sending';
    const val = this.consultForm.getRawValue() as { name: string; email: string; phone: string; contact_method: string; message: string };
    this.api.createConsultation({
      name: val.name,
      email: val.email || undefined,
      phone: val.phone || undefined,
      contact_method: val.contact_method,
      message: val.message || undefined,
    }).subscribe({
      next: () => { this.formState = 'success'; },
      error: () => { this.formState = 'error'; },
    });
  }
}
