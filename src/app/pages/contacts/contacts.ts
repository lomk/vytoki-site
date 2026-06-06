import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

import { SectionApiService, Contact } from '../../section-api.service';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
  imports: [ReactiveFormsModule],
})
export class ContactsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  contacts: Contact | null = null;
  loading = true;
  formState: 'idle' | 'sending' | 'success' | 'error' = 'idle';

  contactMethods = ['phone', 'email', 'telegram', 'viber', 'whatsapp'];

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
    contact_method: new FormControl('phone', { nonNullable: true }),
    message: new FormControl('', { nonNullable: true }),
  });

  constructor(
    private api: SectionApiService,
    public i18n: I18nService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
    this.i18n.lang$.pipe(skip(1), takeUntil(this.destroy$)).subscribe(() => this.load());
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  private load(): void {
    this.loading = true;
    this.api.getContacts().subscribe({
      next: c => { this.contacts = c; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  t(key: string): string { return this.i18n.t(key); }

  telegramUrl(v: string): string {
    if (!v) return '#';
    return v.startsWith('http') ? v : `https://t.me/${v.replace('@', '')}`;
  }

  viberUrl(v: string): string {
    return v ? `viber://chat?number=${v.replace(/\D/g, '')}` : '#';
  }

  whatsappUrl(v: string): string {
    return v ? `https://wa.me/${v.replace(/\D/g, '')}` : '#';
  }

  submit(): void {
    if (this.form.invalid || this.formState === 'sending') return;
    this.formState = 'sending';
    const val = this.form.getRawValue() as { name: string; email: string; phone: string; contact_method: string; message: string };
    this.api.createConsultation({
      name: val.name,
      email: val.email || undefined,
      phone: val.phone || undefined,
      contact_method: val.contact_method,
      message: val.message || undefined,
    }).subscribe({
      next: () => { this.formState = 'success'; this.form.reset(); this.form.patchValue({ contact_method: 'phone' }); this.cdr.markForCheck(); },
      error: () => { this.formState = 'error'; this.cdr.markForCheck(); },
    });
  }
}
