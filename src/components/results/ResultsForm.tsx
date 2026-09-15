'use client';

import { ChevronDown, ArrowUpRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useRef } from 'react';

import { COUNTRY_CODES } from '@/lib/countryCodes';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Other'];
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { api } from '@/lib/api/endpoints';
import { useToast } from '@/components/ui/use-toast';
import { getStoredUTMParameters } from '@/lib/tracking';
import { useLeadOptimization } from '@/hooks/useLeadOptimization';
import { buildThankYouUrl } from '@/lib/thankYou';

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  countryCode: z.string().min(1, "Select a country code"),
  phone: z.string().min(6, "Valid phone number is required"),
  city: z.string().min(1, "Please select a city"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const ResultsForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const {
    sessionId,
    timeOnSite,
    pagesBefore,
    scrollDepth,
    trackAbandonment,
    trackEvent,
    getCalculatorData
  } = useLeadOptimization();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", countryCode: "+91", phone: "", city: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const utmParams = getStoredUTMParameters();
      const calculatorData = getCalculatorData();
      const payload = {
        ...data,
        phone: `${data.countryCode} ${data.phone}`,
        // email field explicitly omitted since UI handles phone only
        subject: "New Results Page Inquiry",
        message: `Inquiry from ${data.city}`,
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
      await api.submitContactForm(payload as any);
      await trackEvent('form_submitted', { form: 'results_page' }, 'CONTACT');
      window.location.assign(buildThankYouUrl({ name: data.name, phone: data.phone }));
    } catch {
      toast({ title: "Error", description: "Failed to submit form. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field: string) => {
    const values = form.getValues();
    trackAbandonment({ formType: 'results_page', currentStep: 1, completedSteps: 0, lastField: field, name: values.name, phone: values.phone });
    trackEvent('field_focused', { field }, 'CONTACT');
  };

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="bg-white py-[48px] lg:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-[16px] md:px-[40px] xl:px-[160px] flex flex-col lg:flex-row justify-between items-start gap-[32px] lg:gap-[80px]">

        {/* ── Left: Heading ── */}
        <div className="w-full lg:max-w-[420px] flex-shrink-0">
          <h2
            style={{
              color: '#121212',
              fontSize: 'clamp(28px, 5vw, 44px)',
              fontWeight: 800,
              lineHeight: '115%',
              letterSpacing: '-0.5px',
            }}
          >
            Fill This Form To Get The Right Guidance
          </h2>
        </div>

        {/* ── Right: Form card ── */}
        <div
          className="w-full lg:max-w-[560px]"
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid rgba(18,18,18,0.08)',
            boxShadow: '0px 8px 40px 0px rgba(18,18,18,0.08)',
            padding: 'clamp(20px, 5vw, 36px)',
          }}
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-[20px]">

            {/* Name */}
            <div className="flex flex-col gap-[6px]">
              <label
                style={{ color: '#121212', fontSize: '15px', fontWeight: 700, lineHeight: '120%', letterSpacing: '-0.1px' }}
              >
                Name
              </label>
              <input
                {...form.register("name")}
                type="text"
                placeholder="Full Name"
                onBlur={() => handleBlur('name')}
                style={{
                  width: '100%',
                  background: '#F5F6F7',
                  borderRadius: '10px',
                  border: '1.5px solid transparent',
                  padding: '14px 16px',
                  fontSize: '15px',
                  color: '#121212',
                  outline: 'none',
                  transition: 'border-color 200ms ease',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#1769FF')}
                onBlurCapture={e => (e.currentTarget.style.borderColor = 'transparent')}
              />
              {form.formState.errors.name && (
                <span style={{ color: '#EF4444', fontSize: '13px' }}>{form.formState.errors.name.message}</span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-[6px]">
              <label
                style={{ color: '#121212', fontSize: '15px', fontWeight: 700, lineHeight: '120%', letterSpacing: '-0.1px' }}
              >
                Phone Number
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <select
                    {...form.register("countryCode")}
                    style={{
                      width: '115px',
                      background: '#F5F6F7',
                      borderRadius: '10px',
                      border: '1.5px solid transparent',
                      padding: '14px 28px 14px 12px',
                      fontSize: '13px',
                      color: '#121212',
                      outline: 'none',
                      appearance: 'none',
                      cursor: 'pointer',
                      height: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.id} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '14px',
                      height: '14px',
                      color: 'rgba(18,18,18,0.4)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
                <input
                  {...form.register("phone")}
                  type="tel"
                  placeholder="98765 43210"
                  onBlur={() => handleBlur('phone')}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: '#F5F6F7',
                    borderRadius: '10px',
                    border: '1.5px solid transparent',
                    padding: '14px 16px',
                    fontSize: '15px',
                    color: '#121212',
                    outline: 'none',
                    transition: 'border-color 200ms ease',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#1769FF')}
                  onBlurCapture={e => (e.currentTarget.style.borderColor = 'transparent')}
                />
              </div>
              {form.formState.errors.phone && (
                <span style={{ color: '#EF4444', fontSize: '13px' }}>{form.formState.errors.phone.message}</span>
              )}
            </div>

            {/* City */}
            <div className="flex flex-col gap-[6px]">
              <label
                style={{ color: '#121212', fontSize: '15px', fontWeight: 700, lineHeight: '120%', letterSpacing: '-0.1px' }}
              >
                City
              </label>
              <div className="relative">
                <select
                  {...form.register("city")}
                  onBlur={() => handleBlur('city')}
                  style={{
                    width: '100%',
                    background: '#F5F6F7',
                    borderRadius: '10px',
                    border: '1.5px solid transparent',
                    padding: '14px 44px 14px 16px',
                    fontSize: '15px',
                    color: '#121212',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                    transition: 'border-color 200ms ease',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#1769FF')}
                  onBlurCapture={e => (e.currentTarget.style.borderColor = 'transparent')}
                >
                  <option value="">Please select</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '18px',
                    height: '18px',
                    color: 'rgba(18,18,18,0.4)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
              {form.formState.errors.city && (
                <span style={{ color: '#EF4444', fontSize: '13px' }}>{form.formState.errors.city.message}</span>
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
              style={{
                width: '100%',
                background: isSubmitting ? 'rgba(23,105,255,0.7)' : 'linear-gradient(104deg, #4686FE 0%, #1769FF 100%)',
                borderRadius: '12px',
                border: 'none',
                padding: '16px 24px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '4px',
                transition: 'opacity 200ms ease, transform 200ms ease',
                boxShadow: '0px 4px 24px 0px rgba(23,105,255,0.30)',
              }}
              onMouseEnter={e => { if (!isSubmitting) (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              {isSubmitting ? (
                <Loader2 style={{ width: '22px', height: '22px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  SUBMIT
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.20)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ArrowUpRight style={{ width: '16px', height: '16px', color: '#fff' }} />
                  </span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
