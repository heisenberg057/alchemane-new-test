'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, CircleCheck, Loader2 } from 'lucide-react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useReveal } from '../HeroSecret/hooks';
import { formAction, formCities, formDone, formTitle } from './content';
import { api } from '@/lib/api/endpoints';
import { getStoredUTMParameters } from '@/lib/tracking';
import { useLeadOptimization } from '@/hooks/useLeadOptimization';
import { useTracking } from '@/providers/TrackingProvider';
import { buildThankYouUrl } from '@/lib/thankYou';
import { useToast } from '@/components/ui/use-toast';

type Fields = { name: string; phone: string; city: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: '', phone: '', city: '' };

function digits(value: string) {
  return value.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
}

function validate(values: Fields): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please tell us your name.';
  if (digits(values.phone).length !== 10)
    errors.phone = 'A 10-digit mobile number, so a consultant can call you.';
  if (!values.city) errors.city = 'Pick the city nearest you.';
  return errors;
}

export default function Form() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const id = useId();
  const { toast } = useToast();
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const {
    sessionId,
    timeOnSite,
    pagesBefore,
    scrollDepth,
    trackEvent,
    getCalculatorData,
  } = useLeadOptimization();
  const { trackConversion } = useTracking();

  const set = (field: keyof Fields, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
  };

  const blur = (field: keyof Fields) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, phone: true, city: true });
    if (Object.keys(found).length > 0) return;

    setIsSubmitting(true);
    try {
      const utmParams = getStoredUTMParameters();
      const calculatorData = getCalculatorData();
      const phoneDigits = digits(values.phone);

      const payload = {
        name: values.name.trim(),
        countryCode: '+91',
        phone: `+91 ${phoneDigits}`,
        city: values.city,
        subject: 'New Homepage Inquiry',
        message: `Inquiry from ${values.city}`,
        ...utmParams,
        sessionId: sessionId || undefined,
        timeOnSite,
        pagesBefore,
        scrollDepth,
        calculatorUsed: !!calculatorData,
        calculatorData,
        isMultiStep: false,
        completedSteps: ['step1'],
        totalSteps: 1,
        timeToComplete: timeOnSite,
        turnstileToken: turnstileToken!,
      };

      await api.submitContactForm(payload as never);
      await trackEvent('form_submitted', { form: 'homepage_contact_v2' }, 'CONTACT');
      try {
        await trackConversion('form_submission', 5000);
      } catch {
        /* tracking is best-effort */
      }

      setDone(true);
      window.location.assign(
        buildThankYouUrl({ name: values.name.trim(), phone: phoneDigits })
      );
    } catch {
      turnstileRef.current?.reset();
      setTurnstileToken(null);
      toast({
        title: 'Error',
        description: 'Failed to submit form. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (key: keyof Fields) => ({
    id: `${id}-${key}`,
    'aria-invalid': errors[key] && touched[key] ? true : undefined,
    'aria-describedby':
      errors[key] && touched[key] ? `${id}-${key}-error` : undefined,
    onBlur: () => blur(key),
  });

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <section className="ahlV2Close form" id="contact-form" aria-labelledby="form-title">
      <div className="form__in wrap" data-shown={shown ? 'true' : 'false'} ref={ref}>
        <h2 className="form__title" id="form-title">
          {formTitle.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <div className="form__card">
          {done ? (
            <div className="form__done" role="status">
              <CircleCheck size={30} strokeWidth={1.8} aria-hidden="true" />
              <h3>{formDone.title}</h3>
              <p>{formDone.body}</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div
                className="form__row"
                data-error={errors.name && touched.name ? 'true' : 'false'}
              >
                <label htmlFor={`${id}-name`}>Name</label>
                <input
                  {...field('name')}
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Full Name"
                  value={values.name}
                  onChange={(e) => set('name', e.target.value)}
                />
                {errors.name && touched.name ? (
                  <p className="form__error" id={`${id}-name-error`}>
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div
                className="form__row"
                data-error={errors.phone && touched.phone ? 'true' : 'false'}
              >
                <label htmlFor={`${id}-phone`}>Phone Number</label>
                <input
                  {...field('phone')}
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="(123)-456 7890"
                  value={values.phone}
                  onChange={(e) => set('phone', e.target.value)}
                />
                {errors.phone && touched.phone ? (
                  <p className="form__error" id={`${id}-phone-error`}>
                    {errors.phone}
                  </p>
                ) : null}
              </div>

              <div
                className="form__row"
                data-error={errors.city && touched.city ? 'true' : 'false'}
              >
                <label htmlFor={`${id}-city`}>City</label>
                <div className="form__select">
                  <select
                    {...field('city')}
                    name="city"
                    value={values.city}
                    onChange={(e) => set('city', e.target.value)}
                  >
                    <option value="">Please select</option>
                    {formCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.city && touched.city ? (
                  <p className="form__error" id={`${id}-city-error`}>
                    {errors.city}
                  </p>
                ) : null}
              </div>

              {siteKey ? (
                <div className="form__turnstile">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={siteKey}
                    onSuccess={setTurnstileToken}
                    onExpire={() => setTurnstileToken(null)}
                    options={{ theme: 'light' }}
                  />
                </div>
              ) : null}

              <button
                type="submit"
                className="btn btn--lg form__submit"
                disabled={isSubmitting || (!!siteKey && !turnstileToken)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="form__spinner" size={16} aria-hidden="true" />
                    Submitting…
                  </>
                ) : (
                  <>
                    {formAction}
                    <ArrowUpRight
                      className="btn__arrow"
                      size={16}
                      strokeWidth={2.4}
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
