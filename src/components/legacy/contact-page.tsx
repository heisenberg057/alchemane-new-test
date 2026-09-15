'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { MapPin, Clock, Loader2, ChevronDown } from 'lucide-react';

import { COUNTRY_CODES } from '@/lib/countryCodes';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Other'];
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { api } from '@/lib/api/endpoints';
import { useToast } from '@/components/ui/use-toast';
import { getStoredUTMParameters } from '@/lib/tracking';
import { useLeadOptimization } from '@/hooks/useLeadOptimization';
import { useTracking } from '@/providers/TrackingProvider';
import { useSiteSettings } from '@/lib/hooks/useSiteSettings';
import { DEFAULT_SETTINGS } from '@/lib/settings/parseSettingsPayload';
import { LOCATION_SALON_ASSET } from '@/components/shared/locationSalonAssets';
import { buildThankYouUrl } from '@/lib/thankYou';

/* ─────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────── */
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   FORM SCHEMA
───────────────────────────────────────────────────────────── */
const contactSchema = z.object({
  name:        z.string().min(2, 'Name is required'),
  countryCode: z.string().min(1, 'Select a country code'),
  phone:       z.string().min(6, 'Valid phone number is required'),
  city:        z.string().min(1, 'Please select a city'),
  email:       z.string().email('Valid email required').or(z.literal('')).optional(),
  query:       z
    .string()
    .trim()
    .refine((value) => value.length === 0 || value.length >= 5, {
      message: 'Please enter at least 5 characters',
    })
    .optional(),
});
type ContactFormValues = z.infer<typeof contactSchema>;

type LeadPageVariant = 'contact' | 'consultation';

type LeadPageContent = {
  heroTitle: string;
  breadcrumbLabel: string;
  formHeading: string;
  formDescription: string;
  queryLabel: string;
  queryPlaceholder: string;
  submitLabel: string;
  submitSubject: string;
  submitSuccessDescription: string;
  submitFallbackMessage: (city: string) => string;
  formType: 'contact' | 'consultation';
  abandonmentFormType: string;
  trackingEventForm: string;
  sidebarCtaLabel: string;
};

export const LEAD_PAGE_CONTENT: Record<LeadPageVariant, LeadPageContent> = {
  contact: {
    heroTitle: 'Contact Us',
    breadcrumbLabel: 'Contact Us',
    formHeading: 'Contact Us',
    formDescription:
      "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    queryLabel: 'Query',
    queryPlaceholder: 'How can we help you?',
    submitLabel: 'SEND MESSAGE',
    submitSubject: 'Contact Page Inquiry',
    submitSuccessDescription: 'We will get back to you shortly.',
    submitFallbackMessage: (city) =>
      `Inquiry from contact page${city ? ` - ${city}` : ''}`,
    formType: 'contact',
    abandonmentFormType: 'contact_page',
    trackingEventForm: 'contact_page',
    sidebarCtaLabel: 'Send Your Inquiry',
  },
  consultation: {
    heroTitle: 'Consultation Form',
    breadcrumbLabel: 'Consultation Form',
    formHeading: 'Book A Consultation',
    formDescription:
      'Fill out the form below and our hair replacement specialists will guide you toward the right non-surgical solution for your needs.',
    queryLabel: 'Tell us about your hair concern',
    queryPlaceholder:
      'Share your hair concern, preferred consultation mode, and any questions you want answered.',
    submitLabel: 'BOOK CONSULTATION',
    submitSubject: 'Consultation Request',
    submitSuccessDescription:
      'Our consultation team will contact you shortly.',
    submitFallbackMessage: (city) =>
      `Consultation request${city ? ` - ${city}` : ''}`,
    formType: 'consultation',
    abandonmentFormType: 'consultation_page',
    trackingEventForm: 'consultation_page',
    sidebarCtaLabel: 'Book a Consultation',
  },
};

/* ─────────────────────────────────────────────────────────────
   CONTACT FORM (inline, contact-page specific)
───────────────────────────────────────────────────────────── */
export function ContactSection({ content }: { content: LeadPageContent }) {
  const { toast } = useToast();
  const { data: site = DEFAULT_SETTINGS } = useSiteSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const { sessionId, timeOnSite, pagesBefore, scrollDepth, trackAbandonment, trackEvent } = useLeadOptimization();
  const { trackConversion } = useTracking();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', countryCode: '+91', phone: '', city: '', email: '', query: '' },
  });

  const scrollToForm = () => {
    const section = document.getElementById('contact-form');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.setTimeout(() => {
      form.setFocus('name');
    }, 300);
  };

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const utmParams = getStoredUTMParameters();
      const normalizedQuery = data.query?.trim() ?? '';
      await api.submitContactForm({
        name: data.name,
        phone: `${data.countryCode} ${data.phone}`,
        email: data.email || '',
        formType: content.formType,
        subject: content.submitSubject,
        message: normalizedQuery.length >= 5
          ? normalizedQuery
          : content.submitFallbackMessage(data.city),
        city: data.city,
        ...utmParams,
        sessionId: sessionId || undefined,
        timeOnSite,
        pagesBefore,
        scrollDepth,
        turnstileToken: turnstileToken!,
      } as any);

      await trackEvent('form_submitted', { form: content.trackingEventForm }, 'CONTACT');
      try { await trackConversion('form_submission', 5000); } catch { /* non-fatal */ }
      window.location.assign(buildThankYouUrl({ name: data.name, phone: data.phone }));
    } catch {
      toast({ title: 'Error', description: 'Failed to send. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field: string) => {
    const v = form.getValues();
    trackAbandonment({ formType: content.abandonmentFormType, currentStep: 1, completedSteps: 0, lastField: field, name: v.name, phone: v.phone });
    trackEvent('field_focused', { field }, 'CONTACT');
  };

  const inputCls = 'w-full px-[14px] py-[12px] text-[16px] text-[#121212] bg-white rounded-[8px] border border-[rgba(18,18,18,0.15)] outline-none placeholder:text-[rgba(18,18,18,0.35)] focus:border-[#1769FF] transition-colors';

  return (
    <section id="contact-form" className="w-full flex justify-center py-[64px] md:py-[80px]">
      <div className="w-full max-w-[1100px] px-4 md:px-10 xl:px-0">

        <div className="bg-white rounded-[20px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.07)] border border-[rgba(18,18,18,0.06)] overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* ── LEFT: Contact Form ── */}
            <div className="flex-1 p-[24px] md:p-[40px] lg:p-[64px] lg:pr-[33px] border-b lg:border-b-0 lg:border-r border-[rgba(18,18,18,0.08)] flex flex-col justify-center">
              <h2 className="text-[24px] md:text-[28px] font-bold text-[#121212] leading-[130%] mb-[8px]">
                {content.formHeading}
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#121212]/70 leading-[155%] tracking-[-0.1px] mb-[24px] md:mb-[28px]">
                {content.formDescription}
              </p>

              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-[18px]">

                {/* Name */}
                <div>
                  <label className="block text-[16px] font-semibold text-[#121212] mb-[7px]">
                    Name: <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...form.register('name')}
                    type="text"
                    placeholder="Enter Your Full Name"
                    className={inputCls}
                    onBlur={() => handleBlur('name')}
                  />
                  {form.formState.errors.name && (
                    <span className="text-red-500 text-sm mt-1 block">{form.formState.errors.name.message}</span>
                  )}
                </div>

                {/* Phone + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
                  <div>
                    <label className="block text-[16px] font-semibold text-[#121212] mb-[7px]">
                      Phone Number: <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-shrink-0">
                        <select
                          {...form.register('countryCode')}
                          className="w-[115px] bg-white rounded-[8px] border border-[rgba(18,18,18,0.15)] pl-2 pr-6 py-[12px] text-[13px] text-[#121212] outline-none focus:border-[#1769FF] appearance-none cursor-pointer transition-colors"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.id} value={c.code}>{c.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[rgba(18,18,18,0.4)] pointer-events-none" />
                      </div>
                      <input
                        {...form.register('phone')}
                        type="tel"
                        placeholder="98765 43210"
                        className={`${inputCls} flex-1 min-w-0`}
                        onBlur={() => handleBlur('phone')}
                      />
                    </div>
                    {form.formState.errors.phone && (
                      <span className="text-red-500 text-sm mt-1 block">{form.formState.errors.phone.message}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[16px] font-semibold text-[#121212] mb-[7px]">
                      Email ID <span className="text-[rgba(18,18,18,0.4)] font-normal">(Optional)</span>
                    </label>
                    <input
                      {...form.register('email')}
                      type="email"
                      placeholder="rahul1234@example.com"
                      className={inputCls}
                      onBlur={() => handleBlur('email')}
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-[16px] font-semibold text-[#121212] mb-[7px]">
                    City: <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      {...form.register('city')}
                      className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                      onBlur={() => handleBlur('city')}
                    >
                      <option value="">Please select</option>
                      {CITIES.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(18,18,18,0.4)] pointer-events-none" />
                  </div>
                  {form.formState.errors.city && (
                    <span className="text-red-500 text-sm mt-1 block">{form.formState.errors.city.message}</span>
                  )}
                </div>

                {/* Query */}
                <div>
                  <label className="block text-[16px] font-semibold text-[#121212] mb-[7px]">
                    {content.queryLabel} <span className="text-[rgba(18,18,18,0.4)] font-normal">(Optional)</span>
                  </label>
                  <textarea
                    {...form.register('query')}
                    rows={4}
                    placeholder={content.queryPlaceholder}
                    className={`${inputCls} resize-none`}
                    onBlur={() => handleBlur('query')}
                  />
                  {form.formState.errors.query && (
                    <span className="text-red-500 text-sm mt-1 block">{form.formState.errors.query.message}</span>
                  )}
                </div>

                {/* Turnstile */}
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  onSuccess={setTurnstileToken}
                  onExpire={() => setTurnstileToken(null)}
                  onError={() => setTurnstileToken(null)}
                />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !turnstileToken}
                  style={{ background: 'linear-gradient(104deg, #4686FE 0%, #1769FF 100%)', borderRadius: 8, padding: '11px 20px', border: 'none', cursor: isSubmitting || !turnstileToken ? 'not-allowed' : 'pointer', opacity: isSubmitting || !turnstileToken ? 0.7 : 1 }}
                  className="inline-flex items-center justify-center gap-2 text-white text-[16px] font-bold uppercase tracking-[0.05em] w-fit transition-opacity"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : content.submitLabel}
                </button>
                {!turnstileToken && (
                  <p className="text-[13px] text-[#121212]/55 leading-[1.5] mt-[-6px]">
                    Complete the verification above to enable the submit button.
                  </p>
                )}

              </form>
            </div>

            {/* ── RIGHT: Reach Out + Follow Us ── */}
            <div className="lg:w-[559px] flex-shrink-0 flex flex-col gap-[32px] p-[24px] md:p-[40px] lg:p-[64px] lg:pr-[47px]"
              style={{ background: 'rgba(245,246,247,0.50)' }}
            >

              {/* Reach Out */}
              <div>
                <h2 className="text-[24px] md:text-[28px] font-bold text-[#121212] leading-[130%] mb-[20px]">
                  Reach Out To Us
                </h2>

                <div className="flex flex-col gap-[12px]">
                  {/* Call */}
                  <a
                    href={`tel:+91${site.phone || DEFAULT_SETTINGS.phone}`}
                    className="flex items-center gap-[12px] md:gap-[16px] px-[14px] md:px-[20px] py-[14px] md:py-[18px] rounded-[12px] bg-white border border-[rgba(18,18,18,0.08)] hover:border-[rgba(23,105,255,0.25)] hover:shadow-[0px_4px_12px_0px_rgba(23,105,255,0.08)] transition-all duration-200 no-underline"
                  >
                    <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center flex-shrink-0 text-white" style={{ background: 'linear-gradient(135deg, #4ABFDD, #2BAECA)' }}>
                      <PhoneIcon />
                    </div>
                    <div>
                      <p className="text-[13px] text-[rgba(18,18,18,0.5)] m-0 mb-[2px]">Call Us</p>
                      <p className="text-[14px] md:text-[16px] font-semibold text-[#121212] m-0">+91 {site.phone || DEFAULT_SETTINGS.phone}</p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/91${site.whatsapp || DEFAULT_SETTINGS.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-[12px] md:gap-[16px] px-[14px] md:px-[20px] py-[14px] md:py-[18px] rounded-[12px] bg-white border border-[rgba(18,18,18,0.08)] hover:border-[rgba(37,211,102,0.3)] hover:shadow-[0px_4px_12px_0px_rgba(37,211,102,0.08)] transition-all duration-200 no-underline"
                  >
                    <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center flex-shrink-0 text-white bg-[#25D366]">
                      <WhatsAppIcon />
                    </div>
                    <div>
                      <p className="text-[13px] text-[rgba(18,18,18,0.5)] m-0 mb-[2px]">WhatsApp</p>
                      <p className="text-[14px] md:text-[16px] font-semibold text-[#121212] m-0">+91 {site.whatsapp || DEFAULT_SETTINGS.whatsapp}</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${site.contactEmail || DEFAULT_SETTINGS.contactEmail}`}
                    className="flex items-center gap-[12px] md:gap-[16px] px-[14px] md:px-[20px] py-[14px] md:py-[18px] rounded-[12px] bg-white border border-[rgba(18,18,18,0.08)] hover:border-[rgba(23,105,255,0.25)] hover:shadow-[0px_4px_12px_0px_rgba(23,105,255,0.08)] transition-all duration-200 no-underline"
                  >
                    <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center flex-shrink-0 text-white" style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)' }}>
                      <MailIcon />
                    </div>
                    <div>
                      <p className="text-[13px] text-[rgba(18,18,18,0.5)] m-0 mb-[2px]">Email Us</p>
                      <p className="text-[14px] md:text-[16px] font-semibold text-[#121212] m-0 break-all">{site.contactEmail || DEFAULT_SETTINGS.contactEmail}</p>
                    </div>
                  </a>
                </div>

                {/* Primary CTA */}
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="flex items-center justify-center no-underline mt-[16px] w-full py-[17px] rounded-[8px] text-white text-[16px] font-bold uppercase tracking-[0.06em] transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(104deg, #4686FE 0%, #1769FF 100%)', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                >
                  {content.sidebarCtaLabel}
                </button>
              </div>

              {/* Follow Us */}
              <div>
                <h3 className="text-[18px] md:text-[20px] font-bold text-[#121212] mb-[14px]">
                  Follow Us
                </h3>
                <div className="flex gap-[12px]">
                  {/* Facebook */}
                  <a href={site.socialFacebook || DEFAULT_SETTINGS.socialFacebook} target="_blank" rel="noopener noreferrer"
                    className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-white border border-[rgba(18,18,18,0.1)] hover:scale-110 transition-transform no-underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12.0013 1.33301H10.0013C9.11725 1.33301 8.2694 1.6842 7.64428 2.30932C7.01916 2.93444 6.66797 3.78229 6.66797 4.66634V6.66634H4.66797V9.33301H6.66797V14.6663H9.33464V9.33301H11.3346L12.0013 6.66634H9.33464V4.66634C9.33464 4.48953 9.40487 4.31996 9.5299 4.19494C9.65492 4.06991 9.82449 3.99967 10.0013 3.99967H12.0013V1.33301Z" stroke="#121212" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  {/* Twitter */}
                  <a href={site.socialX || DEFAULT_SETTINGS.socialX} target="_blank" rel="noopener noreferrer"
                    className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-white border border-[rgba(18,18,18,0.1)] hover:scale-110 transition-transform no-underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M14.6654 2.66636C14.6654 2.66636 14.1987 4.06636 13.332 4.93302C14.3987 11.5997 7.06536 16.4664 1.33203 12.6664C2.7987 12.733 4.26536 12.2664 5.33203 11.333C1.9987 10.333 0.332031 6.39969 1.9987 3.33302C3.46536 5.06636 5.73203 6.06636 7.9987 5.99969C7.3987 3.19969 10.6654 1.59969 12.6654 3.46636C13.3987 3.46636 14.6654 2.66636 14.6654 2.66636Z" stroke="#121212" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a href={site.socialYoutube || DEFAULT_SETTINGS.socialYoutube} target="_blank" rel="noopener noreferrer"
                    className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-white border border-[rgba(18,18,18,0.1)] hover:scale-110 transition-transform no-underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1.66569 11.3333C1.19998 9.13551 1.19998 6.86449 1.66569 4.66667C1.72689 4.44347 1.84512 4.24005 2.00877 4.0764C2.17241 3.91276 2.37583 3.79453 2.59903 3.73333C6.17466 3.14097 9.8234 3.14097 13.399 3.73333C13.6222 3.79453 13.8256 3.91276 13.9893 4.0764C14.1529 4.24005 14.2712 4.44347 14.3324 4.66667C14.7981 6.86449 14.7981 9.13551 14.3324 11.3333C14.2712 11.5565 14.1529 11.7599 13.9893 11.9236C13.8256 12.0872 13.6222 12.2055 13.399 12.2667C9.82341 12.8591 6.17465 12.8591 2.59903 12.2667C2.37583 12.2055 2.17241 12.0872 2.00877 11.9236C1.84512 11.7599 1.72689 11.5565 1.66569 11.3333Z" stroke="#121212" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6.66797 10L10.0013 8L6.66797 6V10Z" stroke="#121212" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a href={site.socialInstagram || DEFAULT_SETTINGS.socialInstagram} target="_blank" rel="noopener noreferrer"
                    className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-white border border-[rgba(18,18,18,0.1)] hover:scale-110 transition-transform no-underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <g clipPath="url(#contact-instagram)">
                        <path d="M11.332 1.33301H4.66536C2.82442 1.33301 1.33203 2.82539 1.33203 4.66634V11.333C1.33203 13.174 2.82442 14.6663 4.66536 14.6663H11.332C13.173 14.6663 14.6654 13.174 14.6654 11.333V4.66634C14.6654 2.82539 13.173 1.33301 11.332 1.33301Z" stroke="#121212" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.6678 7.5802C10.75 8.13503 10.6553 8.70168 10.3969 9.19954C10.1386 9.69741 9.72987 10.1011 9.22886 10.3533C8.72784 10.6055 8.16007 10.6933 7.6063 10.6042C7.05252 10.515 6.54095 10.2536 6.14433 9.85698C5.74772 9.46036 5.48626 8.94878 5.39715 8.39501C5.30804 7.84124 5.39582 7.27346 5.64799 6.77245C5.90017 6.27144 6.3039 5.86269 6.80176 5.60436C7.29963 5.34603 7.86628 5.25126 8.42111 5.33353C8.98706 5.41746 9.51101 5.68118 9.91557 6.08574C10.3201 6.4903 10.5839 7.01425 10.6678 7.5802Z" stroke="#121212" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M11.668 4.33301H11.6746" stroke="#121212" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </g>
                      <defs>
                        <clipPath id="contact-instagram">
                          <rect width="16" height="16" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   STORE LOCATOR
───────────────────────────────────────────────────────────── */
type City = 'MUMBAI' | 'BANGALORE' | 'DELHI';

const stores: Record<City, {
  name: string;
  address: string;
  detailLines?: { text: string; emphasis?: boolean }[];
  hours: { day: string; time: string; closed: boolean }[];
  mapSrc?: string;
  showMap: boolean;
  image: string;
}> = {
  MUMBAI: {
    name: 'American Hairline - Mumbai',
    address: 'Saffron Building, 202, Linking Rd, opposite Satgurus Store, next to Global Desi, Khar West, Mumbai, Maharashtra 400052',
    hours: [
      { day: 'Monday',    time: 'Closed',        closed: true  },
      { day: 'Tuesday',   time: '11 am to 8 pm', closed: false },
      { day: 'Wednesday', time: '11 am to 8 pm', closed: false },
      { day: 'Thursday',  time: '11 am to 8 pm', closed: false },
      { day: 'Friday',    time: '11 am to 8 pm', closed: false },
      { day: 'Saturday',  time: '11 am to 8 pm', closed: false },
      { day: 'Sunday',    time: '11 am to 8 pm', closed: false },
    ],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.861875672087!2d72.83392599999999!3d19.069809600000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c775abf702b3%3A0x2e7f6999bcf443c2!2sAmerican%20Hairline!5e0!3m2!1sen!2sin!4v1776774031582!5m2!1sen!2sin',
    showMap: true,
    image: LOCATION_SALON_ASSET.url,
  },
  BANGALORE: {
    name: 'American Hairline - Bangalore',
    address: 'Golden Hive Luxury Unisex Salon, 484, 2nd Floor, Signature Square, Chinmaya Mission Hospital Rd, Near KFC, next to aLL Plus Size Store, Indiranagar 1st Stage, Bengaluru – 560038',
    detailLines: [
      { text: 'Appointment Required', emphasis: true },
      { text: 'Visits are strictly appointment-based.' },
      { text: 'For slot availability:' },
      { text: 'Call/WhatsApp us on: +91 92226 66111', emphasis: true },
      { text: 'OR', emphasis: true },
      { text: 'Please share your name & number, our team will call you.' },
    ],
    hours: [
      { day: 'Monday',    time: 'Closed',        closed: true  },
      { day: 'Tuesday',   time: '11 am to 8 pm', closed: false },
      { day: 'Wednesday', time: '11 am to 8 pm', closed: false },
      { day: 'Thursday',  time: '11 am to 8 pm', closed: false },
      { day: 'Friday',    time: '11 am to 8 pm', closed: false },
      { day: 'Saturday',  time: '11 am to 8 pm', closed: false },
      { day: 'Sunday',    time: '11 am to 8 pm', closed: false },
    ],
    showMap: false,
    image: LOCATION_SALON_ASSET.url,
  },
  DELHI: {
    name: 'American Hairline - Delhi',
    address: 'Plot No. 2, 2nd Floor, Main Road, Hudson Lane, GTB Nagar, Delhi - 110009',
    detailLines: [
      { text: 'Appointment Required', emphasis: true },
      { text: 'Visits are strictly appointment-based.' },
      { text: 'For slot availability:' },
      { text: 'Call/WhatsApp us on: +91 92226 66111', emphasis: true },
      { text: 'OR', emphasis: true },
      { text: 'Please share your name & number, our team will call you.' },
    ],
    hours: [
      { day: 'Monday',    time: 'Closed',        closed: true  },
      { day: 'Tuesday',   time: '11 am to 8 pm', closed: false },
      { day: 'Wednesday', time: '11 am to 8 pm', closed: false },
      { day: 'Thursday',  time: '11 am to 8 pm', closed: false },
      { day: 'Friday',    time: '11 am to 8 pm', closed: false },
      { day: 'Saturday',  time: '11 am to 8 pm', closed: false },
      { day: 'Sunday',    time: '11 am to 8 pm', closed: false },
    ],
    showMap: false,
    image: LOCATION_SALON_ASSET.url,
  },
};

function StoreLocator() {
  const [activeCity, setActiveCity] = useState<City>('MUMBAI');
  const store = stores[activeCity];

  return (
    <section className="w-full flex justify-center pb-[64px] md:pb-[80px]">
      <div className="w-full max-w-[1100px] px-4 md:px-10 xl:px-0">

        {/* City tabs */}
        <div className="flex justify-center mb-0">
          <div className="flex border-b border-[rgba(18,18,18,0.1)] w-full justify-center">
            {(['MUMBAI', 'BANGALORE', 'DELHI'] as City[]).map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className="px-[28px] py-[12px] text-[14px] font-bold tracking-[0.08em] transition-all duration-200 relative"
                style={{
                  color: activeCity === city ? '#1769FF' : 'rgba(18,18,18,0.45)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {city}
                {activeCity === city && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1769FF] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Store card */}
        <div className="bg-white rounded-b-[20px] rounded-t-none shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] border border-t-0 border-[rgba(18,18,18,0.06)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left: info + hours */}
            <div className="p-[32px] md:p-[40px]">
              <h3 className="text-[20px] font-extrabold text-[#121212] mb-[10px]">
                {store.name}
              </h3>
              <div className="flex gap-[8px] items-start mb-[28px]">
                <MapPin size={15} className="text-[#1769FF] flex-shrink-0 mt-[3px]" />
                <div className="flex flex-col gap-[10px]">
                  <p className="text-[14px] md:text-[15px] text-[#555555] leading-[1.6] m-0">{store.address}</p>
                  {store.detailLines && (
                    <div className="flex flex-col gap-[5px]">
                      {store.detailLines.map((line) => (
                        <p
                          key={line.text}
                          className={`text-[13px] md:text-[14px] leading-[1.55] m-0 ${line.emphasis ? 'font-semibold text-[#121212]' : 'text-[#555555]'}`}
                        >
                          {line.text}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-[6px] mb-[14px]">
                <Clock size={14} className="text-[#1769FF]" />
                <span className="text-[16px] font-bold text-[#121212]">Opening Hours</span>
              </div>

              <div className="flex flex-col gap-[6px]">
                {store.hours.map((h) => (
                  <div key={h.day} className="flex items-center">
                    <span className="text-[13px] md:text-[14px] text-[rgba(18,18,18,0.55)] w-[110px] flex-shrink-0">{h.day}:</span>
                    <span className={`text-[13px] md:text-[14px] font-semibold ${h.closed ? 'text-red-500' : 'text-[#121212]'}`}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual / map */}
            <div className={`flex flex-col ${store.showMap ? '' : 'min-h-[320px] lg:min-h-full'}`}>
              <div className={`relative w-full overflow-hidden ${store.showMap ? 'h-[200px] md:h-[220px]' : 'h-[320px] md:h-[360px] lg:h-full min-h-[320px]'}`}>
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  className="object-cover object-center"
                />
              </div>

              {store.showMap && store.mapSrc && (
                <div className="relative flex-1 min-h-[200px]">
                  <iframe
                    src={store.mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: 200, display: 'block' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${store.name} Map`}
                  />
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export function LegacyLeadFormPage({
  variant = 'contact',
}: {
  variant?: LeadPageVariant;
}) {
  const content = LEAD_PAGE_CONTENT[variant];

  return (
    <main className="bg-[#F5F6F7] min-h-screen">

      {/* ── HERO BANNER ── */}
      <section
        className="w-full flex flex-col items-center justify-center py-[56px] md:py-[80px] px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)' }}
      >
        <h1 className="text-[32px] md:text-[48px] font-extrabold text-white leading-[1.15] tracking-[-0.5px] mb-[14px]">
          {content.heroTitle}
        </h1>
        <p className="text-white/70 text-[18px] font-medium">
          Home / <span className="text-white font-semibold">{content.breadcrumbLabel}</span>
        </p>
      </section>

      {/* ── CONTACT FORM + REACH OUT ── */}
      <ContactSection content={content} />

      {/* ── STORE LOCATOR ── */}
      <StoreLocator />

    </main>
  );
}

export default function ContactUsPage() {
  return <LegacyLeadFormPage variant="contact" />;
}
