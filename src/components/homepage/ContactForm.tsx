'use client';

import { ChevronDown, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useRef } from 'react';

import { COUNTRY_CODES } from '@/lib/countryCodes';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { api } from '@/lib/api/endpoints';
import { useToast } from '@/components/ui/use-toast';
import { getStoredUTMParameters } from '@/lib/tracking';
import { useLeadOptimization } from '@/hooks/useLeadOptimization';
import { useTracking } from '@/providers/TrackingProvider';
import { useSiteSettings } from '@/lib/hooks/useSiteSettings';
import { DEFAULT_SETTINGS } from '@/lib/settings/parseSettingsPayload';
import { buildThankYouUrl } from '@/lib/thankYou';

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  countryCode: z.string().min(1, "Select a country code"),
  phone: z.string().min(6, "Valid phone number is required"),
  city: z.string().min(1, "Please select a city"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const { toast } = useToast();
  const { data: site = DEFAULT_SETTINGS } = useSiteSettings();
  const cities = (site.formCities || DEFAULT_SETTINGS.formCities)
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
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

  const { trackConversion } = useTracking();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      countryCode: "+91",
      phone: "",
      city: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // Get Tracking Data
      const utmParams = getStoredUTMParameters();
      const calculatorData = getCalculatorData();

      const payload = {
        ...data,
        phone: `${data.countryCode} ${data.phone}`,
        // email field explicitly omitted since UI handles phone only
        subject: "New Homepage Inquiry",
        message: `Inquiry from ${data.city}`,
        ...utmParams,
        sessionId: sessionId || undefined,
        timeOnSite,
        pagesBefore,
        scrollDepth,
        calculatorUsed: !!calculatorData,
        calculatorData,
        isMultiStep: false,
        completedSteps: ['step1'], // Single step form
        totalSteps: 1,
        timeToComplete: timeOnSite, // Approximation for now
        turnstileToken: turnstileToken!,
      };

      await api.submitContactForm(payload as any);
      
      // Track Conversion for Lead Optimization Engine
      await trackEvent('form_submitted', { form: 'homepage_contact' }, 'CONTACT');

      // Track Conversion for Marketing/UTM Analytics (The "Missing Link")
      try {
        await trackConversion('form_submission', 5000); // 5000 is default lead value
      } catch (err) {
        console.error('Marketing conversion tracking failed', err);
      }
      window.location.assign(buildThankYouUrl({ name: data.name, phone: data.phone }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field: string) => {
    const values = form.getValues();
    trackAbandonment({
      formType: 'homepage_contact',
      currentStep: 1,
      completedSteps: 0,
      lastField: field,
      name: values.name,
      phone: values.phone,
      // email is not collected here
    });
    
    trackEvent('field_focused', { field }, 'CONTACT');
  };

  return (
    <AnimateOnScroll variant="fadeUp">
    <section id="contact-form" className="py-[40px] md:py-[60px] lg:py-20 bg-white flex justify-center">
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row justify-between px-[20px] md:px-[60px] lg:px-[160px] gap-10">
         {/* Left Title */}
         <div>
            <h2 className="text-[28px] md:text-[36px] lg:text-5xl font-extrabold text-dark leading-tight">
               Fill This Form to Get the<br />Right Guidance
            </h2>
         </div>

         {/* Form */}
         <div className="w-full lg:w-[500px] bg-white border border-dark/10 rounded-2xl p-8 shadow-lg flex flex-col gap-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                 <label className="text-xl font-bold text-dark">Name</label>
                 <input 
                    {...form.register("name")}
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full bg-[#efefef] rounded-lg px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-primary/50"
                    onBlur={() => handleBlur('name')}
                 />
                 {form.formState.errors.name && (
                    <span className="text-red-500 text-sm">{form.formState.errors.name.message}</span>
                 )}
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-xl font-bold text-dark">Phone Number</label>
                 <div className="flex gap-2">
                    <div className="relative flex-shrink-0">
                      <select
                        {...form.register("countryCode")}
                        className="h-[56px] w-[115px] bg-[#efefef] rounded-lg pl-2 pr-6 text-sm outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.id} value={c.code}>{c.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark/50 pointer-events-none" />
                    </div>
                    <input
                      {...form.register("phone")}
                      type="tel"
                      placeholder="98765 43210"
                      className="h-[56px] min-w-0 flex-1 bg-[#efefef] rounded-lg px-4 text-lg outline-none focus:ring-2 focus:ring-primary/50"
                      onBlur={() => handleBlur('phone')}
                    />
                 </div>
                 {form.formState.errors.phone && (
                    <span className="text-red-500 text-sm">{form.formState.errors.phone.message}</span>
                 )}
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-xl font-bold text-dark">City</label>
                 <div className="relative">
                    <select 
                      {...form.register("city")}
                      className="w-full bg-[#efefef] rounded-lg px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-primary/50 appearance-none text-dark/50 cursor-pointer"
                      onBlur={() => handleBlur('city')}
                    >
                       <option value="">Please select</option>
                       {cities.map((city) => (
                         <option key={city} value={city}>{city}</option>
                       ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-dark/50 pointer-events-none" />
                 </div>
                 {form.formState.errors.city && (
                    <span className="text-red-500 text-sm">{form.formState.errors.city.message}</span>
                 )}
              </div>

              <div className="w-full overflow-x-auto">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  onSuccess={setTurnstileToken}
                  onExpire={() => setTurnstileToken(null)}
                  onError={() => setTurnstileToken(null)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !turnstileToken}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#4686fe] to-[#1769ff] text-white px-6 h-[56px] rounded-xl font-semibold text-[18px] tracking-[0.2px] hover:opacity-90 transition-opacity mt-2 disabled:opacity-70"
                style={{ fontFamily: '"Proxima Nova", sans-serif' }}
              >
                 {isSubmitting ? (
                   <Loader2 className="w-6 h-6 animate-spin" />
                 ) : (
                   <>
                     <span>Submit</span>
                     <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0, aspectRatio: '1/1' }}>
                       <path d="M18.8 2H9.2C5.22355 2 2 5.22355 2 9.2V18.8C2 22.7765 5.22355 26 9.2 26H18.8C22.7765 26 26 22.7765 26 18.8V9.2C26 5.22355 22.7765 2 18.8 2Z" fill="white"/>
                       <path fillRule="evenodd" clipRule="evenodd" d="M11.4286 10.3036C11.4286 9.85977 11.7883 9.5 12.2321 9.5H17.6964C18.1403 9.5 18.5 9.85977 18.5 10.3036V15.7678C18.5 16.2117 18.1403 16.5714 17.6964 16.5714C17.2526 16.5714 16.8929 16.2117 16.8929 15.7678V12.2436L10.8718 18.2647C10.558 18.5784 10.0492 18.5784 9.73536 18.2647C9.42155 17.9509 9.42155 17.4421 9.73536 17.1283L15.7564 11.1072H12.2321C11.7883 11.1072 11.4286 10.7474 11.4286 10.3036Z" fill="url(#submit-arrow-gradient)"/>
                       <defs>
                         <linearGradient id="submit-arrow-gradient" x1="9.98568" y1="7.47965" x2="20.5393" y2="10.0167" gradientUnits="userSpaceOnUse">
                           <stop stopColor="#4686FE"/>
                           <stop offset="1" stopColor="#1769FF"/>
                         </linearGradient>
                       </defs>
                     </svg>
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
