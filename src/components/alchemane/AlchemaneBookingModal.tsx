'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { COUNTRY_CODES } from '@/lib/countryCodes';
import styles from './AlchemaneBookingModal.module.css';

const PREFERRED_CALL_TIMES = [
  '11:00 AM – 12:00 PM',
  '12:00 PM – 1:00 PM',
  '1:00 PM – 2:00 PM',
  '2:00 PM – 3:00 PM',
  '3:00 PM – 4:00 PM',
  '4:00 PM – 5:00 PM',
  '5:00 PM – 6:00 PM',
  '6:00 PM – 7:00 PM',
  '7:00 PM – 8:00 PM',
] as const;

const CONSULTATION_MODES = [
  { value: 'in_person_mumbai', label: 'In-Person Consultation (Mumbai)' },
  { value: 'online', label: 'Online Consultation' },
] as const;

type ConsultationMode = (typeof CONSULTATION_MODES)[number]['value'];

type FormState = {
  name: string;
  countryId: string;
  phone: string;
  confirmCountryId: string;
  confirmPhone: string;
  email: string;
  city: string;
  preferredTime: string;
  consultationMode: ConsultationMode | '';
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const DEFAULT_COUNTRY_ID = 'in';

const EMPTY_FORM: FormState = {
  name: '',
  countryId: DEFAULT_COUNTRY_ID,
  phone: '',
  confirmCountryId: DEFAULT_COUNTRY_ID,
  confirmPhone: '',
  email: '',
  city: '',
  preferredTime: PREFERRED_CALL_TIMES[0],
  consultationMode: '',
};

const dialCode = (countryId: string) => COUNTRY_CODES.find((c) => c.id === countryId)?.code ?? '';

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (values.name.trim().length < 2) errors.name = 'Enter your full name.';
  if (!/^[0-9\s-]{6,15}$/.test(values.phone.trim())) errors.phone = 'Enter a valid phone number.';
  if (
    values.confirmPhone.trim() !== values.phone.trim() ||
    dialCode(values.confirmCountryId) !== dialCode(values.countryId)
  ) {
    errors.confirmPhone = "Phone numbers don't match.";
  }
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!values.city.trim()) errors.city = 'Enter your city.';
  if (!values.preferredTime) errors.preferredTime = 'Select a preferred time.';
  if (!values.consultationMode) errors.consultationMode = 'Select a consultation mode.';
  return errors;
}

export function AlchemaneBookingModal({
  open,
  onClose,
  thankYouHref,
}: {
  open: boolean;
  onClose: () => void;
  thankYouHref: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setValues(EMPTY_FORM);
      setErrors({});
      setSubmitting(false);
      const id = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitting(true);
      window.setTimeout(() => {
        onClose();
        router.push(thankYouHref);
      }, 450);
    }
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="alc-booking-title" ref={dialogRef}>
        <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>

        <h2 id="alc-booking-title" className={styles.title}>Book Your Consultation</h2>
        <p className={styles.lead}>Share a few details and we&apos;ll confirm your slot.</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="alc-bk-name">Full Name</label>
            <input
              ref={firstFieldRef}
              id="alc-bk-name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              disabled={submitting}
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
            />
            {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="alc-bk-phone">Phone Number</label>
            <div className={styles.phoneRow}>
              <select
                aria-label="Country code"
                disabled={submitting}
                value={values.countryId}
                onChange={(e) => update('countryId', e.target.value)}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <input
                id="alc-bk-phone"
                type="tel"
                autoComplete="tel-national"
                inputMode="tel"
                placeholder="Phone number"
                disabled={submitting}
                value={values.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
            </div>
            {errors.phone ? <span className={styles.error}>{errors.phone}</span> : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="alc-bk-confirm-phone">Confirm Phone Number</label>
            <div className={styles.phoneRow}>
              <select
                aria-label="Country code for confirmation"
                disabled={submitting}
                value={values.confirmCountryId}
                onChange={(e) => update('confirmCountryId', e.target.value)}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <input
                id="alc-bk-confirm-phone"
                type="tel"
                autoComplete="off"
                inputMode="tel"
                placeholder="Re-enter number"
                disabled={submitting}
                value={values.confirmPhone}
                onChange={(e) => update('confirmPhone', e.target.value)}
              />
            </div>
            {errors.confirmPhone ? <span className={styles.error}>{errors.confirmPhone}</span> : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="alc-bk-email">Email ID (optional)</label>
            <input
              id="alc-bk-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              disabled={submitting}
              value={values.email}
              onChange={(e) => update('email', e.target.value)}
            />
            {errors.email ? <span className={styles.error}>{errors.email}</span> : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="alc-bk-city">City</label>
            <input
              id="alc-bk-city"
              type="text"
              autoComplete="address-level2"
              placeholder="e.g. Mumbai"
              disabled={submitting}
              value={values.city}
              onChange={(e) => update('city', e.target.value)}
            />
            {errors.city ? <span className={styles.error}>{errors.city}</span> : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="alc-bk-time">Preferred Time for the Call</label>
            <select
              id="alc-bk-time"
              disabled={submitting}
              value={values.preferredTime}
              onChange={(e) => update('preferredTime', e.target.value)}
            >
              {PREFERRED_CALL_TIMES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.preferredTime ? <span className={styles.error}>{errors.preferredTime}</span> : null}
          </div>

          <fieldset className={styles.group} disabled={submitting}>
            <legend className={styles.label}>Consultation Mode</legend>
            {CONSULTATION_MODES.map((mode) => (
              <label key={mode.value} className={styles.radio}>
                <input
                  type="radio"
                  name="alc-bk-mode"
                  value={mode.value}
                  checked={values.consultationMode === mode.value}
                  onChange={() => update('consultationMode', mode.value)}
                />
                <span>{mode.label}</span>
              </label>
            ))}
            {errors.consultationMode ? <span className={styles.error}>{errors.consultationMode}</span> : null}
          </fieldset>

          <button type="submit" className={`cta ${styles.submit}`} disabled={submitting}>
            {submitting ? 'Booking…' : 'Book My Consultation'}
          </button>
          <p className={styles.note}>Paid consultation · Fee confirmed at booking · In-person in Mumbai or online</p>
        </form>
      </div>
    </div>
  );
}
