'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
import { useSiteSettings } from '@/lib/hooks/useSiteSettings';
import { DEFAULT_SETTINGS } from '@/lib/settings/parseSettingsPayload';

export const Footer = () => {
  const { data: site = DEFAULT_SETTINGS } = useSiteSettings();
  return (
    <footer className="bg-[#f3f6ff] pt-[37px] pb-[12px] px-[16px] md:pt-[60px] lg:pt-20 md:pb-8 md:px-[60px] lg:px-[160px] flex flex-col items-start md:items-center">
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row justify-between items-start lg:items-start mb-[48px] md:mb-16 gap-[40px] lg:gap-0">
         {/* Brand & Social */}
         <div className="flex flex-col gap-6 max-w-sm items-start text-left">
            <div className="w-[143px] h-[56px] md:w-[155px] md:h-[60px] relative">
               <Image src="/assets/mkxm0e5w-j3lk0es.png" alt="American Hairline" fill className="object-contain" />
            </div>
            <p 
               className="text-[16px] text-[#555] font-normal leading-[155%] tracking-[-0.16px] md:text-lg md:text-dark-secondary md:leading-relaxed"
               style={{ fontFamily: '"Proxima Nova", sans-serif' }}
            >
               Regain your confidence with India’s most natural-looking, non-surgical hair replacement solutions. Designed for those who value aesthetics, privacy, and premium results.
            </p>
            <div className="flex gap-[12px] md:gap-4 mt-2 items-center">
               {/* Facebook */}
               <a href={site.socialFacebook || DEFAULT_SETTINGS.socialFacebook} target="_blank" rel="noopener noreferrer" className="md:bg-white md:p-2 md:rounded-full md:shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                   <g clipPath="url(#clip0_facebook)">
                     <path d="M14.7527 23.2226C14.7562 23.1894 14.758 23.1556 14.758 23.1215V15.0198H17.5275C17.9715 15.0198 18.3712 14.7274 18.4361 14.2881C18.5434 13.5615 18.4979 12.9007 18.4284 12.4309C18.3647 11.9995 17.9803 11.7156 17.5443 11.7156H14.758C14.758 9.21885 15.1735 8.85555 17.5154 8.8101C17.9648 8.8014 18.3682 8.5047 18.4334 8.06C18.543 7.3125 18.4993 6.6594 18.4305 6.19995C18.367 5.77555 17.9865 5.4989 17.5574 5.50265C13.4181 5.53875 11.0606 6.02815 11.0606 11.7156H8.91625C8.4995 11.7156 8.1295 11.9768 8.06645 12.3888C7.99855 12.8326 7.9575 13.4759 8.07085 14.2584C8.13635 14.7105 8.54295 15.0198 8.99975 15.0198H11.0606V23.247C7.85565 23.2259 5.5616 23.0994 4.06785 22.9781C2.42393 22.8445 1.15551 21.576 1.02194 19.9321C0.88904 18.2964 0.75 15.7007 0.75 12C0.75 8.2993 0.88904 5.70365 1.02194 4.06785C1.15551 2.42392 2.42392 1.15551 4.06785 1.02194C5.70365 0.889035 8.2993 0.75 12 0.75C15.7007 0.75 18.2964 0.88904 19.9321 1.02194C21.576 1.15551 22.8445 2.42393 22.9781 4.06785C23.111 5.70365 23.25 8.2993 23.25 12C23.25 15.7007 23.111 18.2964 22.9781 19.9321C22.8445 21.5761 21.576 22.8445 19.9321 22.9781C18.7369 23.0751 17.0294 23.1756 14.7527 23.2226Z" fill="#121212"/>
                   </g>
                   <defs>
                     <clipPath id="clip0_facebook">
                       <rect width="24" height="24" fill="white"/>
                     </clipPath>
                   </defs>
                 </svg>
               </a>
               {/* Twitter/X */}
               <a href={site.socialX || DEFAULT_SETTINGS.socialX} target="_blank" rel="noopener noreferrer" className="md:bg-white md:p-2 md:rounded-full md:shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5 1C3.93913 1 2.92172 1.42143 2.17157 2.17157C1.42143 2.92172 1 3.93913 1 5V19C1 20.0609 1.42143 21.0783 2.17157 21.8284C2.92172 22.5786 3.93913 23 5 23H19C20.0609 23 21.0783 22.5786 21.8284 21.8284C22.5786 21.0783 23 20.0609 23 19V5C23 3.93913 22.5786 2.92172 21.8284 2.17157C21.0783 1.42143 20.0609 1 19 1H5ZM4.666 4.5C4.55653 4.54068 4.45808 4.60637 4.37848 4.69182C4.29887 4.77727 4.24033 4.88013 4.2075 4.99221C4.17468 5.10428 4.16848 5.22248 4.1894 5.33737C4.21032 5.45227 4.25778 5.56069 4.328 5.654L9.942 13.104L4.027 19.449L3.983 19.5H6.03L10.86 14.321L14.572 19.249C14.6581 19.3631 14.775 19.4502 14.909 19.5H19.331C19.4403 19.4591 19.5386 19.3933 19.6179 19.3077C19.6973 19.2222 19.7556 19.1193 19.7883 19.0072C19.8209 18.8952 19.8269 18.7771 19.8059 18.6623C19.7848 18.5475 19.7373 18.4392 19.667 18.346L14.053 10.896L20.017 4.5H17.967L13.137 9.68L9.423 4.752C9.33702 4.63756 9.22008 4.55012 9.086 4.5H4.666ZM15.546 18.048L6.431 5.952H8.45L17.564 18.047L15.546 18.048Z" fill="#121212"/>
                  </svg>
               </a>
               {/* Instagram */}
               <a href={site.socialInstagram || DEFAULT_SETTINGS.socialInstagram} target="_blank" rel="noopener noreferrer" className="md:bg-white md:p-2 md:rounded-full md:shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.47989 1C2.87628 1 0.765625 3.11065 0.765625 5.71428V18.2857C0.765625 20.8893 2.87628 23 5.47989 23H18.0513C20.6549 23 22.7655 20.8893 22.7655 18.2857V5.71428C22.7655 3.11065 20.6549 1 18.0513 1H5.47989ZM19.4084 5.72111C19.4084 6.47106 18.8004 7.07902 18.0504 7.07902C17.3005 7.07902 16.6925 6.47106 16.6925 5.72111C16.6925 4.97114 17.3005 4.36319 18.0504 4.36319C18.8004 4.36319 19.4084 4.97114 19.4084 5.72111ZM11.7658 8.23381C9.6859 8.23381 7.99977 9.91994 7.99977 11.9999C7.99977 14.0798 9.6859 15.7659 11.7658 15.7659C13.8458 15.7659 15.5319 14.0798 15.5319 11.9999C15.5319 9.91994 13.8458 8.23381 11.7658 8.23381ZM6.18921 11.9999C6.18921 8.91999 8.68595 6.42326 11.7658 6.42326C14.8457 6.42326 17.3424 8.91999 17.3424 11.9999C17.3424 15.0798 14.8457 17.5765 11.7658 17.5765C8.68595 17.5765 6.18921 15.0798 6.18921 11.9999Z" fill="#121212"/>
                  </svg>
               </a>
               {/* Youtube */}
               <a href={site.socialYoutube || DEFAULT_SETTINGS.socialYoutube} target="_blank" rel="noopener noreferrer" className="md:bg-white md:p-2 md:rounded-full md:shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <g clipPath="url(#clip0_youtube)">
                      <path d="M12.0825 3.57031H12.216C13.4488 3.57481 19.6954 3.61981 21.3797 4.07274C21.8888 4.21097 22.3528 4.48041 22.7252 4.85413C23.0976 5.22786 23.3654 5.69277 23.5018 6.20242C23.6533 6.77234 23.7598 7.52673 23.8318 8.30511L23.8468 8.46109L23.8798 8.85103L23.8918 9.00701C23.9893 10.3778 24.0013 11.6616 24.0028 11.9421V12.0546C24.0013 12.3455 23.9878 13.7163 23.8798 15.1441L23.8678 15.3016L23.8543 15.4576C23.7793 16.3154 23.6683 17.1673 23.5018 17.7942C23.3654 18.3039 23.0976 18.7688 22.7252 19.1425C22.3528 19.5162 21.8888 19.7857 21.3797 19.9239C19.6399 20.3918 13.0274 20.4248 12.111 20.4263H11.8981C11.4346 20.4263 9.51791 20.4173 7.5082 20.3483L7.25324 20.3393L7.12276 20.3333L6.8663 20.3228L6.60984 20.3123C4.94508 20.2388 3.35982 20.1204 2.62942 19.9224C2.12044 19.7843 1.65659 19.5151 1.2842 19.1416C0.911808 18.7682 0.643903 18.3036 0.507239 17.7942C0.340763 17.1688 0.22978 16.3154 0.154791 15.4576L0.142793 15.3001L0.130794 15.1441C0.0563505 14.1279 0.0153344 13.1095 0.0078125 12.0906L0.0078125 11.9061C0.0108121 11.5836 0.0228103 10.4693 0.103798 9.23947L0.114297 9.085L0.118796 9.00701L0.130794 8.85103L0.163789 8.46109L0.178787 8.30511C0.250777 7.52673 0.357261 6.77084 0.508738 6.20242C0.645174 5.69277 0.912977 5.22786 1.28538 4.85413C1.65779 4.48041 2.12176 4.21097 2.63092 4.07274C3.36132 3.87777 4.94658 3.75778 6.61134 3.6828L6.8663 3.6723L7.12426 3.6633L7.25324 3.6588L7.5097 3.6483C8.93705 3.60241 10.365 3.57691 11.7931 3.57181L12.0825 3.57031ZM9.60639 8.3846V15.6105L15.841 11.9991L9.60639 8.3846Z" fill="#121212"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_youtube">
                        <rect width="24" height="24" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
               </a>
            </div>
         </div>

         {/* Links */}
         <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-20 w-full lg:w-auto items-start lg:items-start text-left lg:text-left mt-[42px] lg:mt-0">
            {/* Quick Links */}
            <div>
               <h4 className="text-[18px] font-semibold text-[#121212] leading-[22px] tracking-[-0.1px] mb-6 md:text-xl md:font-bold md:text-dark">Quick Links</h4>
               <ul 
                  className="flex flex-col gap-[20px] md:gap-4 text-[16px] text-[#555] leading-[24px] tracking-[-0.16px] items-start lg:items-start md:text-lg md:text-dark-secondary"
                  style={{ fontFamily: '"Proxima Nova", sans-serif' }}
               >
                  <li><Link href="/about-us" className="cursor-pointer hover:text-primary">About us</Link></li>
                  <li><Link href="/contact-us" className="cursor-pointer hover:text-primary">Customer Support</Link></li>
                  <li><Link href="/terms-of-service" className="cursor-pointer hover:text-primary">Terms of Services</Link></li>
                  <li><Link href="/privacy-policy" className="cursor-pointer hover:text-primary">Privacy Policy</Link></li>
                  <li><Link href="/disclaimer" className="cursor-pointer hover:text-primary">Disclaimer Policy</Link></li>
                  <li><Link href="/blog" className="cursor-pointer hover:text-primary">Blog</Link></li>
               </ul>
            </div>

            {/* Solutions */}
            <div>
               <h4 className="text-[18px] font-semibold text-[#121212] leading-[22px] tracking-[-0.1px] mb-6 md:text-xl md:font-bold md:text-dark">Solution</h4>
               <ul 
                  className="flex flex-col gap-[20px] md:gap-4 text-[16px] text-[#555] leading-[24px] tracking-[-0.16px] items-start lg:items-start md:text-lg md:text-dark-secondary"
                  style={{ fontFamily: '"Proxima Nova", sans-serif' }}
               >
                  <li><Link href="/hair-patch-vs-hair-system" className="cursor-pointer hover:text-primary">Non-Surgical Hair Replacement</Link></li>
                  <li><Link href="/scalp-micropigmentation" className="cursor-pointer hover:text-primary">Scalp Micro Pigmentation</Link></li>
                  <li><Link href="/hair-transplant" className="cursor-pointer hover:text-primary">Hair Transplant</Link></li>
               </ul>
            </div>

            {/* Contact */}
            <div>
               <h4 className="text-[18px] font-semibold text-[#121212] leading-[22px] tracking-[-0.1px] mb-6 md:text-xl md:font-bold md:text-dark">Contact Us</h4>
               <ul 
                  className="flex flex-col gap-[20px] md:gap-4 text-[16px] text-[#555] leading-[24px] tracking-[-0.16px] items-start lg:items-start md:text-lg md:text-dark-secondary"
                  style={{ fontFamily: '"Proxima Nova", sans-serif' }}
               >
                  <li className="flex items-center gap-3">
                     <div className="bg-transparent md:bg-white p-1 md:p-2 rounded-lg shadow-none md:shadow-sm"><Phone className="w-4 h-4 md:w-5 md:h-5 text-[#121212] md:text-primary" /></div>
                     <a href={`tel:${site.phone || DEFAULT_SETTINGS.phone}`} className="hover:text-primary">{site.phone || DEFAULT_SETTINGS.phone}</a>
                  </li>
                  <li className="flex items-center gap-3">
                     <div className="bg-transparent md:bg-white p-1 md:p-2 rounded-lg shadow-none md:shadow-sm"><Mail className="w-4 h-4 md:w-5 md:h-5 text-[#121212] md:text-primary" /></div>
                     <a href={`mailto:${site.contactEmail || DEFAULT_SETTINGS.contactEmail}`} className="hover:text-primary">{site.contactEmail || DEFAULT_SETTINGS.contactEmail}</a>
                  </li>
               </ul>
            </div>
         </div>
      </div>

      {/* Copyright */}
      <div className="w-full max-w-[1440px] border-t border-[#12121214] pt-[15px] md:pt-8 text-center mt-[28px] md:mt-0">
         <p 
            className="text-[14px] text-[#555] leading-[22px] tracking-[-0.1px] md:text-dark-secondary"
            style={{ fontFamily: '"Proxima Nova", sans-serif' }}
         >
            American Hairline © {new Date().getFullYear()} – All Rights Reserved.
         </p>
      </div>
    </footer>
  );
};
