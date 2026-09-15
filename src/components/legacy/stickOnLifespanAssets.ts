const BASE = "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media";

export const STICK_ON_LIFESPAN_BASE_ASSETS = {
  thin: {
    card: {
      desktop: {
        url: `${BASE}/Thin base card-2.png`,
        alt: "Thin base low density stick-on hair system card image.",
      },
      mobile: {
        url: `${BASE}/Thin base card-3.png`,
        alt: "Mobile thin base low density stick-on hair system card image.",
      },
    },
    modal: {
      desktop: {
        url: `${BASE}/Thin base overlay card.png`,
        alt: "Thin base low density stick-on hair system detail image.",
      },
      mobile: {
        url: `${BASE}/Thin base overlay card-1.png`,
        alt: "Mobile thin base low density stick-on hair system detail image.",
      },
    },
  },
  thick: {
    card: {
      desktop: {
        url: `${BASE}/Thick base card-2.png`,
        alt: "Thick base high density stick-on hair system card image.",
      },
      mobile: {
        url: `${BASE}/Thick base card-3.png`,
        alt: "Mobile thick base high density stick-on hair system card image.",
      },
    },
    modal: {
      desktop: {
        url: `${BASE}/Thick base overlay card.png`,
        alt: "Thick base high density stick-on hair system detail image.",
      },
      mobile: {
        url: `${BASE}/Thick base overlay card-1.png`,
        alt: "Mobile thick base high density stick-on hair system detail image.",
      },
    },
  },
} as const;

export const STICK_ON_LIFESPAN_CAR_ASSETS = {
  sport: {
    desktop: {
      url: `${BASE}/sport.png`,
      alt: "Sports car comparison image for the stick-on lifespan page.",
    },
    mobile: {
      url: `${BASE}/sport-1.png`,
      alt: "Mobile sports car comparison image for the stick-on lifespan page.",
    },
  },
  fortuner: {
    desktop: {
      url: `${BASE}/fortuner.png`,
      alt: "Fortuner SUV comparison image for the stick-on lifespan page.",
    },
    mobile: {
      url: `${BASE}/fortuner-1.png`,
      alt: "Mobile Fortuner SUV comparison image for the stick-on lifespan page.",
    },
  },
} as const;
