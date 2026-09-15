'use client';

import Link from 'next/link';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { SchemaInput } from '@/components/seo/SchemaMarkup';

interface CityPageProps {
  city: string;
  stateName?: string;
  studioAddress?: string;
  phone?: string;
  mapEmbedUrl?: string;
  schema?: SchemaInput;
}

const defaultServices = [
  { title: 'Hair Patch for Men', href: '/hair-patch-for-men', desc: 'Custom-made patches using 100% real human hair. Matched to your exact colour, texture, and density.' },
  { title: 'Clip-On Hair Systems', href: '/clip-on-hair-system', desc: 'No shaving required. Clips onto existing hair for instant coverage of thinning or bald areas.' },
  { title: 'Stick-On Hair Systems', href: '/clip-on-or-stick-on/stick-on-hair-system', desc: 'Medical-grade adhesive bonding for maximum security. Swim, gym, and shower — all day, every day.' },
  { title: 'Scalp Micropigmentation', href: '/scalp-micropigmentation', desc: 'Non-invasive cosmetic tattoo technique that creates the look of a closely shaved head or fills in thinning areas.' },
  { title: 'Swiss Lace Hair Patch', href: '/swiss-lace-hair-patch', desc: 'The most natural-looking hairline available. Ultra-thin lace base — completely undetectable up close.' },
  { title: 'Customized Hair Systems', href: '/customized-hair-systems', desc: 'Every element built to order — base size, colour, density, wave pattern, and hairline shape.' },
];

const faqs = (city: string) => [
  {
    q: `Is there an American Hairline studio in ${city}?`,
    a: `Yes, we serve clients in ${city} through our certified studio network. Contact us to schedule a consultation at our nearest location in ${city}.`,
  },
  {
    q: `How much does a hair system cost in ${city}?`,
    a: `Prices vary based on the base type chosen (Swiss lace, skin base, mono) and the degree of customisation required. Book a free consultation in ${city} for a personalised quote.`,
  },
  {
    q: `Can I get a home visit / doorstep consultation in ${city}?`,
    a: `We primarily conduct consultations at our certified studios. However, in select cases we do accommodate special requests. Contact us to discuss your needs.`,
  },
  {
    q: `How long does the procedure take at your ${city} studio?`,
    a: `The initial application takes approximately 1–2 hours at the studio. After that, maintenance sessions typically take 45–60 minutes.`,
  },
];

export default function CityPage({ city, stateName, studioAddress, phone, mapEmbedUrl, schema }: CityPageProps) {
  const cityFaqs = faqs(city);

  return (
    <main className="min-h-screen bg-white font-sans">
      {schema && <SchemaMarkup schema={schema} />}
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0a1628] to-[#1a3050] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.1),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <span className="inline-block bg-amber-400/20 text-amber-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-amber-400/30">
            Serving {city}{stateName ? `, ${stateName}` : ''}
          </span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6 max-w-3xl">
            Non-Surgical Hair Replacement in <span className="text-amber-400">{city}</span> — Natural, Undetectable Results
          </h1>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-2xl">
            American Hairline brings India's most advanced non-surgical hair replacement systems to {city}. Custom-made with 100% real human hair and applied by internationally trained specialists — no surgery, no downtime, permanent-looking results.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/consultation-form" className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-amber-400/30">
              Book Free Consultation in {city}
            </Link>
            <a href={`https://wa.me/919820908894?text=Hi, I am from ${city} and want to book a consultation.`} target="_blank" rel="noopener noreferrer" className="border border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-xl transition-all hover:bg-white/10">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Why AHL in This City */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose American Hairline in {city}?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We bring 15+ years of hair replacement expertise, internationally trained specialists, and India's most advanced hair systems to {city}.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: '100% Real Human Hair', desc: 'Every system uses only genuine human hair — matched precisely to your colour, texture, and density.' },
            { title: 'Certified Specialists', desc: 'Applied by professionally trained and certified hair technicians with hands-on experience across thousands of clients.' },
            { title: 'Custom-Made for You', desc: 'No stock systems. Every unit is built from scratch to match your exact hair loss pattern and personal style.' },
            { title: 'Zero Surgery', desc: 'No incisions, no needles, no pain, no downtime. Walk in, walk out with a full head of natural hair.' },
            { title: 'Ongoing Support', desc: 'We schedule regular maintenance sessions and coaching on home care to maximise your system\'s lifespan.' },
            { title: 'Privacy Guaranteed', desc: 'All consultations in our {city} studio are completely private and handled with discretion and sensitivity.' },
          ].map((card) => (
            <div key={card.title} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-3 h-3 bg-amber-400 rounded-full mb-4" />
              <h3 className="font-bold text-gray-900 text-lg mb-2">{card.title.replace('{city}', city)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{card.desc.replace('{city}', city)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Available */}
      <section className="py-20 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Services Available in {city}</h2>
            <p className="text-slate-400 text-lg">Our full range of hair replacement solutions — available to {city} clients.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {defaultServices.map((svc) => (
              <Link key={svc.title} href={svc.href} className="block bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
                <h3 className="text-amber-400 font-bold text-lg mb-2 group-hover:text-amber-300 transition-colors">{svc.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{svc.desc}</p>
                <div className="mt-4 text-slate-400 text-sm group-hover:text-white transition-colors">Learn more →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Info */}
      {studioAddress && (
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Visit Us in {city}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-4">
              <div>
                <p className="text-sm font-semibold text-amber-600 uppercase mb-1">Studio Address</p>
                <p className="text-gray-900 font-medium">{studioAddress}</p>
              </div>
              {phone && (
                <div>
                  <p className="text-sm font-semibold text-amber-600 uppercase mb-1">Phone</p>
                  <a href={`tel:${phone}`} className="text-gray-900 font-medium hover:text-amber-600 transition-colors">{phone}</a>
                </div>
              )}
              <Link href="/consultation-form" className="block w-full bg-[#0a1628] text-white font-bold py-3 px-6 rounded-xl text-center hover:bg-[#1a3050] transition-colors mt-4">
                Book Appointment
              </Link>
            </div>
            {mapEmbedUrl ? (
              <div className="h-64 rounded-2xl overflow-hidden border border-slate-200">
                <iframe src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`American Hairline ${city} Studio`} />
              </div>
            ) : (
              <div className="h-64 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-3">📍</div>
                  <p className="text-gray-600 font-medium">Serving {city}</p>
                  <p className="text-gray-400 text-sm mt-1">Contact us for studio location</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="py-16 bg-amber-400">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: '10,000+', label: 'Men Transformed' },
            { stat: '15+ Years', label: 'Experience' },
            { stat: '100%', label: 'Real Human Hair' },
            { stat: '4.9 ★', label: 'Google Rating' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-4xl font-black text-black">{item.stat}</p>
              <p className="text-black/70 text-sm font-medium mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">FAQs — Hair Replacement in {city}</h2>
          </div>
          <div className="space-y-4">
            {cityFaqs.map((faq) => (
              <details key={faq.q} className="bg-white border border-slate-200 rounded-2xl p-6 group cursor-pointer hover:shadow-md transition-shadow">
                <summary className="font-semibold text-gray-900 text-lg list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-amber-500 text-2xl group-open:rotate-45 transition-transform duration-200 flex-shrink-0 ml-4">+</span>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0a1628] to-[#1a3050] text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Restore Your Hair in {city}?</h2>
          <p className="text-slate-300 text-lg mb-8">Book a free, private consultation with our {city} specialists today.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/consultation-form" className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-10 py-4 rounded-xl transition-all shadow-lg">
              Book Free Consultation
            </Link>
            <a href={`https://wa.me/919820908894?text=Hi, I am from ${city} and want to book a consultation.`} target="_blank" rel="noopener noreferrer" className="border border-white/30 hover:border-white text-white font-semibold px-10 py-4 rounded-xl transition-all hover:bg-white/10">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
