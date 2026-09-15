'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

import type { FunnelPageMeta } from '@/config/funnel-pages';
import { COUNTRY_CODES } from '@/lib/countryCodes';
import { api } from '@/lib/api/endpoints';
import { useToast } from '@/components/ui/use-toast';
import { getStoredUTMParameters } from '@/lib/tracking';
import { useLeadOptimization } from '@/hooks/useLeadOptimization';
import { useTracking } from '@/providers/TrackingProvider';
import { buildThankYouUrl } from '@/lib/thankYou';

export const PREFERRED_CALL_TIMES = [
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

export const CONSULTATION_MODES = [
  { value: 'in_person_mumbai', label: 'In-Person Consultation (Mumbai)' },
  { value: 'online', label: 'Online Consultation' },
] as const;

const funnelContactSchema = z
  .object({
    name: z.string().min(2, 'Full name is required'),
    countryCode: z.string().min(1, 'Select a country code'),
    phone: z.string().min(6, 'Valid phone number is required'),
    confirmCountryCode: z.string().min(1, 'Select a country code'),
    confirmPhone: z.string().min(6, 'Please confirm your phone number'),
    email: z.string().email('Valid email required'),
    city: z.string().min(1, 'City is required'),
    preferredTime: z.string().min(1, 'Please select a preferred time'),
    consultationMode: z.union([
      z.literal('in_person_mumbai'),
      z.literal('online'),
    ], { error: 'Please select a consultation mode' }),
  })
  .refine(
    (data) => data.phone === data.confirmPhone && data.countryCode === data.confirmCountryCode,
    {
      message: 'Phone numbers do not match',
      path: ['confirmPhone'],
    }
  );

type FunnelContactFormValues = z.infer<typeof funnelContactSchema>;

const inputCls =
  'w-full px-[14px] py-[12px] text-[16px] text-[#121212] bg-white rounded-[8px] border border-[rgba(18,18,18,0.15)] outline-none placeholder:text-[rgba(18,18,18,0.35)] focus:border-[#1769FF] transition-colors';

function consultationModeLabel(value: FunnelContactFormValues['consultationMode']) {
  return CONSULTATION_MODES.find((m) => m.value === value)?.label ?? value;
}

export function FunnelContactForm({ meta }: { meta: FunnelPageMeta }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const { sessionId, timeOnSite, pagesBefore, scrollDepth, trackAbandonment, trackEvent } =
    useLeadOptimization();
  const { trackConversion } = useTracking();

  const form = useForm<FunnelContactFormValues>({
    resolver: zodResolver(funnelContactSchema),
    defaultValues: {
      name: '',
      countryCode: '+91',
      phone: '',
      confirmCountryCode: '+91',
      confirmPhone: '',
      email: '',
      city: '',
      preferredTime: PREFERRED_CALL_TIMES[0],
      consultationMode: undefined,
    },
  });

  const handleBlur = (field: string) => {
    const v = form.getValues();
    trackAbandonment({
      formType: meta.trackingEventForm,
      currentStep: 1,
      completedSteps: 0,
      lastField: field,
      name: v.name,
      phone: v.phone,
    });
    trackEvent('field_focused', { field }, 'CONTACT');
  };

  const onSubmit = async (data: FunnelContactFormValues) => {
    setIsSubmitting(true);
    try {
      const utmParams = Object.fromEntries(
        Object.entries(getStoredUTMParameters()).filter(([, v]) => v != null && v !== '')
      ) as Record<string, string>;
      const fullPhone = `${data.countryCode} ${data.phone}`;
      const confirmFullPhone = `${data.confirmCountryCode} ${data.confirmPhone}`;
      const modeLabel = consultationModeLabel(data.consultationMode);

      const message = [
        `Preferred call time: ${data.preferredTime}`,
        `Consultation mode: ${modeLabel}`,
        `Funnel: ${meta.slug}`,
      ].join('\n');

      await api.submitContactForm({
        name: data.name,
        phone: fullPhone,
        confirmPhone: confirmFullPhone,
        email: data.email,
        city: data.city,
        preferredTime: data.preferredTime,
        consultationMode: modeLabel,
        funnelSlug: meta.slug,
        formType: 'consultation',
        subject: `Landing Page ${meta.slug}`,
        message,
        ...utmParams,
        sessionId: sessionId || undefined,
        timeOnSite,
        pagesBefore,
        scrollDepth,
        turnstileToken: turnstileToken!,
      });

      await trackEvent('form_submitted', { form: meta.trackingEventForm }, 'CONTACT');
      try {
        await trackConversion('form_submission', 5000);
      } catch {
        /* non-fatal */
      }

      window.location.assign(buildThankYouUrl({ name: data.name, phone: data.phone }));
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-[14px]">
      <input
        {...form.register('name')}
        type="text"
        placeholder="Full Name"
        className={inputCls}
        onBlur={() => handleBlur('name')}
      />
      {form.formState.errors.name && (
        <span className="text-red-500 text-sm -mt-2">{form.formState.errors.name.message}</span>
      )}

      <div className="flex gap-2">
        <div className="relative flex-shrink-0">
          <select
            {...form.register('countryCode')}
            className="h-full min-h-[46px] w-[115px] bg-white rounded-[8px] border border-[rgba(18,18,18,0.15)] pl-2 pr-6 py-[12px] text-[13px] text-[#121212] outline-none focus:border-[#1769FF] appearance-none cursor-pointer transition-colors"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.id} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[rgba(18,18,18,0.4)] pointer-events-none" />
        </div>
        <input
          {...form.register('phone')}
          type="tel"
          placeholder="Phone Number"
          className={`${inputCls} flex-1 min-w-0`}
          onBlur={() => handleBlur('phone')}
        />
      </div>
      {form.formState.errors.phone && (
        <span className="text-red-500 text-sm -mt-2">{form.formState.errors.phone.message}</span>
      )}

      <div className="flex gap-2">
        <div className="relative flex-shrink-0">
          <select
            {...form.register('confirmCountryCode')}
            className="h-full min-h-[46px] w-[115px] bg-white rounded-[8px] border border-[rgba(18,18,18,0.15)] pl-2 pr-6 py-[12px] text-[13px] text-[#121212] outline-none focus:border-[#1769FF] appearance-none cursor-pointer transition-colors"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={`confirm-${c.id}`} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[rgba(18,18,18,0.4)] pointer-events-none" />
        </div>
        <input
          {...form.register('confirmPhone')}
          type="tel"
          placeholder="Confirm Phone Number"
          className={`${inputCls} flex-1 min-w-0`}
          onBlur={() => handleBlur('confirmPhone')}
        />
      </div>
      {form.formState.errors.confirmPhone && (
        <span className="text-red-500 text-sm -mt-2">
          {form.formState.errors.confirmPhone.message}
        </span>
      )}

      <input
        {...form.register('email')}
        type="email"
        placeholder="Email ID"
        className={inputCls}
        onBlur={() => handleBlur('email')}
      />
      {form.formState.errors.email && (
        <span className="text-red-500 text-sm -mt-2">{form.formState.errors.email.message}</span>
      )}

      <input
        {...form.register('city')}
        type="text"
        placeholder="City"
        className={inputCls}
        onBlur={() => handleBlur('city')}
      />
      {form.formState.errors.city && (
        <span className="text-red-500 text-sm -mt-2">{form.formState.errors.city.message}</span>
      )}

      <div>
        <label className="block text-[15px] font-medium text-[#121212] mb-[8px]">
          Select a Preferred Time for the Call
        </label>
        <div className="relative">
          <select
            {...form.register('preferredTime')}
            className={`${inputCls} appearance-none pr-10 cursor-pointer`}
            onBlur={() => handleBlur('preferredTime')}
          >
            {PREFERRED_CALL_TIMES.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(18,18,18,0.4)] pointer-events-none" />
        </div>
        {form.formState.errors.preferredTime && (
          <span className="text-red-500 text-sm mt-1 block">
            {form.formState.errors.preferredTime.message}
          </span>
        )}
      </div>

      <fieldset>
        <legend className="block text-[15px] font-medium text-[#121212] mb-[10px]">
          Consultation Mode :
        </legend>
        <div className="flex flex-col gap-[10px]">
          {CONSULTATION_MODES.map((mode) => (
            <label
              key={mode.value}
              className="flex items-center gap-[10px] text-[15px] text-[#121212] cursor-pointer"
            >
              <input
                type="radio"
                value={mode.value}
                {...form.register('consultationMode')}
                className="h-[18px] w-[18px] accent-[#1769FF]"
                onBlur={() => handleBlur('consultationMode')}
              />
              {mode.label}
            </label>
          ))}
        </div>
        {form.formState.errors.consultationMode && (
          <span className="text-red-500 text-sm mt-1 block">
            {form.formState.errors.consultationMode.message}
          </span>
        )}
      </fieldset>

      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={setTurnstileToken}
        onExpire={() => setTurnstileToken(null)}
        onError={() => setTurnstileToken(null)}
      />

      <button
        type="submit"
        disabled={isSubmitting || !turnstileToken}
        style={{
          background: 'linear-gradient(104deg, #4686FE 0%, #1769FF 100%)',
          borderRadius: 8,
          padding: '14px 20px',
          border: 'none',
          cursor: isSubmitting || !turnstileToken ? 'not-allowed' : 'pointer',
          opacity: isSubmitting || !turnstileToken ? 0.7 : 1,
        }}
        className="w-full inline-flex items-center justify-center gap-2 text-white text-[16px] font-bold uppercase tracking-[0.05em] transition-opacity mt-[4px]"
      >
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SUBMIT'}
      </button>
    </form>
  );
}
