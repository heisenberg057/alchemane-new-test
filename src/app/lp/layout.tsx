import { Montserrat } from 'next/font/google';
import './funnel.css';
import './funnel-desktop.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-funnel-montserrat',
  display: 'swap',
});

export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-funnel-montserrat),Montserrat,sans-serif]`}>
      {children}
    </div>
  );
}
