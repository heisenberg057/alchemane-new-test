/** Lookup table from legacy exitIntent.service.js */

const POPUPS: Record<
  string,
  {
    type: string;
    title: string;
    message: string;
    cta: string;
    image: string | null;
  }
> = {
  "/services/hair-transplant": {
    type: "offer",
    title: "Wait! Get Your Free Consultation",
    message:
      "Before you go, speak with our hair restoration specialist. Free consultation, no obligation.",
    cta: "Book Free Consultation",
    image: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-natural-hairline-doctor-design.png",
  },
  "/blog": {
    type: "guide",
    title: "Free Hair Transplant Guide",
    message:
      "Download our comprehensive guide to hair transplant procedures, costs, and recovery.",
    cta: "Get Free Guide",
    image: "/assets/about-ebook.png",
  },
  "/contact-us": {
    type: "callback",
    title: "Need Help?",
    message: "Let us call you back. Our specialists are available now.",
    cta: "Request Callback",
    image: null,
  },
  default: {
    type: "chat",
    title: "Questions?",
    message: "Chat with us now or get a free consultation.",
    cta: "Start Chat",
    image: null,
  },
};

export function getExitIntentPopupContent(
  page: string,
  _device: string
): (typeof POPUPS)["default"] {
  return POPUPS[page] ?? POPUPS.default;
}
