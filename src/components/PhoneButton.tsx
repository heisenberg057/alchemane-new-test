'use client';

import { Phone } from 'lucide-react';
import { useTracking } from '@/providers/TrackingProvider';

interface PhoneButtonProps {
  phoneNumber: string;
  className?: string;
  showIcon?: boolean;
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const PhoneButton = ({ 
  phoneNumber, 
  className = "", 
  showIcon = true,
  label,
  variant = 'primary'
}: PhoneButtonProps) => {
  const { trackConversion } = useTracking();

  const handlePhoneClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent default immediately if we want to track first, but usually href works parallel
    // e.preventDefault(); 
    
    // Track click
    await trackConversion('phone_click', 50, { 
      phone: phoneNumber,
      location: 'phone_button_click'
    });

    // Proceed to call (handled by anchor href)
  };

  const getVariantClasses = () => {
    switch(variant) {
      case 'primary': return 'bg-primary text-white hover:bg-primary/90';
      case 'secondary': return 'bg-secondary text-white hover:bg-secondary/90';
      case 'outline': return 'border border-primary text-primary hover:bg-primary/10';
      case 'ghost': return 'text-primary hover:bg-primary/10';
      default: return 'bg-primary text-white';
    }
  };

  return (
    <a 
      href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
      onClick={handlePhoneClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${getVariantClasses()} ${className}`}
    >
      {showIcon && <Phone className="w-4 h-4" />}
      <span>{label || phoneNumber}</span>
    </a>
  );
};
