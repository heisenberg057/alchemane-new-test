'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AlchemaneBookingModal.module.css';

type FormState = {
  name: string;
  city: string;
  phone: string;
  confirmPhone: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = { name: '', city: '', phone: '', confirmPhone: '' };

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Enter your name.';
  if (!values.city.trim()) errors.city = 'Enter your city.';
  if (!/^[0-9+\s-]{7,15}$/.test(values.phone.trim())) errors.phone = 'Enter a valid phone number.';
  if (values.confirmPhone.trim() !== values.phone.trim()) errors.confirmPhone = "Phone numbers don't match.";
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

  const field = (key: keyof FormState) => ({
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [key]: e.target.value })),
  });

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
          <label className={styles.field}>
            <span className={styles.label}>Name</span>
            <input ref={firstFieldRef} type="text" autoComplete="name" placeholder="Your full name" disabled={submitting} {...field('name')} />
            {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>City</span>
            <input type="text" autoComplete="address-level2" placeholder="e.g. Mumbai" disabled={submitting} {...field('city')} />
            {errors.city ? <span className={styles.error}>{errors.city}</span> : null}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Phone Number</span>
            <input type="tel" autoComplete="tel" placeholder="10-digit mobile number" disabled={submitting} {...field('phone')} />
            {errors.phone ? <span className={styles.error}>{errors.phone}</span> : null}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Confirm Phone Number</span>
            <input type="tel" autoComplete="tel" placeholder="Re-enter your number" disabled={submitting} {...field('confirmPhone')} />
            {errors.confirmPhone ? <span className={styles.error}>{errors.confirmPhone}</span> : null}
          </label>

          <button type="submit" className={`cta ${styles.submit}`} disabled={submitting}>
            {submitting ? 'Booking…' : 'Book My Consultation'}
          </button>
          <p className={styles.note}>Paid consultation · Fee confirmed at booking · In-person in Mumbai or online</p>
        </form>
      </div>
    </div>
  );
}
