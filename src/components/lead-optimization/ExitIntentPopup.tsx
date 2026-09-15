'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/endpoints';
import { useLeadOptimization } from '@/hooks/useLeadOptimization';
import { usePathname } from 'next/navigation';

export const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [hasShown, setHasShown] = useState(false);
  const { sessionId, trackEvent, trackTrigger } = useLeadOptimization();
  const pathname = usePathname();

  // Effect 1: Fetch content when page changes
  useEffect(() => {
    if (!sessionId) return;

    const fetchContent = async () => {
      try {
        const data = await api.getExitIntentContent(pathname || '/', window.innerWidth < 768 ? 'mobile' : 'desktop');
        setContent(data);
      } catch (error) {
        console.error('Failed to get exit intent content', error);
      }
    };

    fetchContent();
  }, [pathname, sessionId]);

  // Effect 2: Handle exit intent trigger
  useEffect(() => {
    // Don't setup listener if already shown in this session
    const shownInSession = sessionStorage.getItem('ah_exit_intent_shown');
    if (shownInSession) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown && !show && content) {
        setShow(true);
        setHasShown(true);
        sessionStorage.setItem('ah_exit_intent_shown', 'true');
        
        // Track tracking
        api.recordExitIntent({
          sessionId,
          page: pathname,
          timeOnPage: 0, // Should calculate actual time
          scrollDepth: 0, // Should get actual scroll
          popupType: content.type,
          popupContent: content.title,
          action: 'viewed',
          device: 'desktop'
        });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [pathname, hasShown, show, content, sessionId]);

  const handleClose = () => {
    setShow(false);
    api.recordExitIntent({
        sessionId,
        page: pathname,
        timeOnPage: 0,
        scrollDepth: 0,
        popupType: content?.type || 'unknown',
        action: 'dismissed'
    });
  };

  const handleCta = () => {
    setShow(false);
    api.recordExitIntent({
        sessionId,
        page: pathname,
        timeOnPage: 0,
        scrollDepth: 0,
        popupType: content?.type || 'unknown',
        action: 'converted'
    });
    
    // Redirect or open modal based on type
    if (content?.type === 'offer') {
       window.location.href = '/contact-us';
    }
  };

  if (!show || !content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row">
           {content.image && (
             <div className="relative w-full md:w-1/3 bg-gray-100 hidden md:block">
               <Image
                 src={content.image}
                 alt="Offer"
                 fill
                 className="object-cover"
                 sizes="(max-width: 768px) 0px, 200px"
               />
             </div>
           )}
           
           <div className={`p-8 ${content.image ? 'md:w-2/3' : 'w-full'}`}>
             <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
               {content.type === 'offer' ? 'Special Offer' : 'Don\'t Miss Out'}
             </span>
             
             <h3 className="text-2xl font-bold text-gray-900 mb-2">
               {content.title}
             </h3>
             
             <p className="text-gray-600 mb-6">
               {content.message}
             </p>
             
             <div className="flex flex-col gap-3">
               <Button onClick={handleCta} className="w-full gap-2">
                 {content.cta}
                 <ArrowRight className="w-4 h-4" />
               </Button>
               <button 
                 onClick={handleClose}
                 className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
               >
                 No thanks, I'll pass
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
