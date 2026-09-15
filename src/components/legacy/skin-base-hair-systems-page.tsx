'use client';

import Link from 'next/link';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { skinBaseSchema } from '@/config/page-schemas';

const features = [
  { title: 'Scalp-Like Appearance', desc: 'The polyurethane skin base mimics your natural scalp colour and texture — creating a seamless, invisible bond at any parting.' },
  { title: 'Zero Lace Lines', desc: 'Unlike lace bases, skin bases have no mesh pattern. Up close or far away — the illusion is perfect.' },
  { title: 'Strong & Durable', desc: 'Skin base systems are more durable than lace — lasting longer through swimming, gym, and daily wear.' },
  { title: 'Seamless Edges', desc: 'The thin polyurethane perimeter bonds flush with your scalp so there is no visible edge even in strong light.' },
  { title: 'Easy Maintenance', desc: 'Simpler to clean and reattach compared to delicate lace bases — great for active users.' },
  { title: '100% Human Hair', desc: 'Every skin base system uses only real, premium human hair — styled and coloured to match you precisely.' },
];

const comparisons = [
  { aspect: 'Appearance', skin: 'Scalp-realistic seamless look', lace: 'Ultra-natural hairline, slight mesh texture visible up close' },
  { aspect: 'Durability', skin: 'Higher — typically lasts longer', lace: 'Delicate — requires careful handling' },
  { aspect: 'Breathability', skin: 'Good', lace: 'Excellent — maximum airflow' },
  { aspect: 'Best For', skin: 'Scalp coverage, active lifestyles', lace: 'Hairline replication, first-time wearers' },
];

export default function SkinBaseHairSystemsPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <SchemaMarkup schema={skinBaseSchema as any} />
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1a1036] to-[#2d1b69] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(245,158,11,0.12),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <span className="inline-block bg-purple-400/20 text-purple-200 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-purple-400/30">
            Seamless · Scalp-Realistic · Durable
          </span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6 max-w-3xl">
            Skin Base Hair Systems — <span className="text-amber-400">The Most Realistic Scalp</span> You'll Ever See
          </h1>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-2xl">
            Skin base hair systems use a thin polyurethane base that looks and feels exactly like your real scalp. No mesh, no lace pattern — just a completely natural-looking head of hair from top to bottom.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/consultation-form" className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-8 py-4 rounded-xl transition-all shadow-lg">
              Book Free Consultation
            </Link>
            <Link href="/products" className="border border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-xl transition-all hover:bg-white/10">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose a Skin Base System?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">The skin base is the most scalp-realistic option — ideal when you want a completely invisible base from any angle.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-gradient-to-br from-slate-50 to-purple-50/30 border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 bg-[#2d1b69] rounded-xl mb-4 flex items-center justify-center">
                <div className="w-4 h-4 bg-amber-400 rounded-full" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Skin Base vs Lace Base — What's Right for You?</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-[#1a1036] text-white">
                  <th className="text-left px-6 py-4 font-bold">Feature</th>
                  <th className="text-left px-6 py-4 font-bold text-amber-400">Skin Base</th>
                  <th className="text-left px-6 py-4 font-bold">Lace Base</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={row.aspect} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-6 py-4 font-semibold text-gray-900">{row.aspect}</td>
                    <td className="px-6 py-4 text-gray-700">{row.skin}</td>
                    <td className="px-6 py-4 text-gray-700">{row.lace}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">Not sure which is right for you? Our specialists will guide you in a free consultation.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1a1036] to-[#2d1b69] text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Your Skin Base System Today</h2>
          <p className="text-slate-300 text-lg mb-8">Book a free consultation and our experts will help you choose the perfect system for your lifestyle.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/consultation-form" className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-10 py-4 rounded-xl transition-all shadow-lg">
              Book Consultation
            </Link>
            <a href="https://wa.me/919820908894" target="_blank" rel="noopener noreferrer" className="border border-white/30 hover:border-white text-white font-semibold px-10 py-4 rounded-xl transition-all hover:bg-white/10">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
