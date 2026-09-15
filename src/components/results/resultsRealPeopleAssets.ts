export type ResultsRealPeopleVariant = "stick-on" | "clip-on";
export type ResultsRealPeopleFilterKey =
  | "all"
  | "lowDensity"
  | "highDensity"
  | "shortHair"
  | "mediumHair"
  | "longHair";

export type ResultsRealPeopleItem = {
  key: string;
  name: string;
  variant: ResultsRealPeopleVariant;
  quote: string;
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
};

export const RESULTS_REAL_PEOPLE_FILTERS = {
  lowDensity: {
    label: "Low Density",
    items: [
      {
        key: "low-density-rahil",
        name: "RAHIL KHAN",
        variant: "clip-on",
        quote: "The transformation is amazing. It feels light, comfortable, and completely natural.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/RAHIL KHAN DESKTOP CLIP ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/RAHIL KHAN MOBILE CLIP ON.png",
        alt: "Before and after clip-on hair system result for Rahil Khan in the low density category.",
      },
      {
        key: "low-density-azhar",
        name: "AZHAR SHAIKH",
        variant: "stick-on",
        quote: "No one could tell I’ve done anything. That’s how seamless it looks.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/AZHAR SHAIKH DESKTOP STICK ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/AZHAR SHAIKH MOBILE STICK ON.png",
        alt: "Before and after stick-on hair system result for Azhar Shaikh in the low density category.",
      },
      {
        key: "low-density-fuzail",
        name: "FUZAIL KHAN",
        variant: "clip-on",
        quote: "It blends seamlessly with my natural hair. I feel like myself again, but better!",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/FUZAIL KHAN DESKTOP CLIP ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/FUZAIL KHAN MOBILE CLIP ON.png",
        alt: "Before and after clip-on hair system result for Fuzail Khan in the low density category.",
      },
      {
        key: "low-density-saurabh",
        name: "SAURABH MISHRA",
        variant: "stick-on",
        quote: "Exactly the kind of natural look I was hoping for. Loved the result.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/SAURABH MISHRA DESKTOP STICK ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/SAURABH MISHRA MOBILE STICK ON.png",
        alt: "Before and after stick-on hair system result for Saurabh Mishra in the low density category.",
      },
      {
        key: "low-density-sahil",
        name: "SAHIL KHAN",
        variant: "clip-on",
        quote: "It feels so light and looks completely natural. I’m very satisfied.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/SAHIL KHAN DESKTOP CLIP ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/SAHIL KHAN Mobile clip on.png",
        alt: "Before and after clip-on hair system result for Sahil Khan in the low density category.",
      },
      {
        key: "low-density-rohit",
        name: "ROHIT CHOUDHARY",
        variant: "stick-on",
        quote: "I was looking for something subtle, and this is perfect. It adds volume without looking too heavy.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/ROHIT CHOUDHARY DESKTOP STICK ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/ROHIT CHOUDHARY MOBILE STICK ON.png",
        alt: "Before and after stick-on hair system result for Rohit Choudhary in the low density category.",
      },
    ] satisfies ResultsRealPeopleItem[],
  },
  highDensity: {
    label: "High Density",
    items: [
      {
        key: "high-density-advik",
        name: "ADVIK SHARMA",
        variant: "clip-on",
        quote: "My hair finally looks fuller without looking fake. That’s the best part.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/ADVIK SHARMA DESKTOP CLIP ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/ADVIK SHARMA MOBILE CLIP ON.png",
        alt: "Before and after clip-on hair system result for Advik Sharma in the high density category.",
      },
      {
        key: "high-density-rylan",
        name: "RYLAN RODRIGUES",
        variant: "clip-on",
        quote: "The volume looks so natural, not overdone at all. Exactly what I wanted.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/RYLAN RODRIGUES DESKTOP CLIP ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/RYLAN RODRIGUES MOBILE CLIP ON.png",
        alt: "Before and after clip-on hair system result for Rylan Rodrigues in the high density category.",
      },
      {
        key: "high-density-chandan",
        name: "CHANDAN SINGH",
        variant: "stick-on",
        quote: "I didn’t expect it to look this real. It blends perfectly with my natural hair.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/CHANDAN SINGH DESKTOP STICK ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/CHANDAN SINGH MOBILE STICK ON.png",
        alt: "Before and after stick-on hair system result for Chandan Singh in the high density category.",
      },
      {
        key: "high-density-varun",
        name: "VARUN DESAI",
        variant: "clip-on",
        quote: "The transformation is unbelievable. It looks and feels so natural, I forget I’m wearing it.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/VARUN DESAI DESKTOP CLIP ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/VARUN DESAI MOBILE CLIP ON.png",
        alt: "Before and after clip-on hair system result for Varun Desai in the high density category.",
      },
      {
        key: "high-density-daljit",
        name: "DALJIT SINGH",
        variant: "stick-on",
        quote: "The finish is so smooth and natural. I’m really happy with the result.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/DALJIT SINGH DESKTOP STICK ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/DALJIT SINGH MOBILE STICK ON.png",
        alt: "Before and after stick-on hair system result for Daljit Singh in the high density category.",
      },
    ] satisfies ResultsRealPeopleItem[],
  },
  shortHair: {
    label: "Short Hair",
    items: [
      {
        key: "short-hair-azhar",
        name: "AZHAR SHAIKH",
        variant: "stick-on",
        quote: "No one could tell I’ve done anything. That’s how seamless it looks.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/AZHAR SHAIKH DESKTOP STICK ON-1.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/AZHAR SHAIKH MOBILE STICK ON-1.png",
        alt: "Before and after stick-on hair system result for Azhar Shaikh in the short hair category.",
      },
      {
        key: "short-hair-fuzail",
        name: "FUZAIL KHAN",
        variant: "clip-on",
        quote: "It blends seamlessly with my natural hair. I feel like myself again, but better!",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/FUZAIL KHAN DESKTOP CLIP ON-1.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/FUZAIL KHAN MOBILE CLIPON.png",
        alt: "Before and after clip-on hair system result for Fuzail Khan in the short hair category.",
      },
      {
        key: "short-hair-daljit",
        name: "DALJIT SINGH",
        variant: "stick-on",
        quote: "The finish is so smooth and natural. I’m really happy with the result.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/DALJIT SINGH DESKTOP STICK ON-1.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/DALJIT SINGH MOBILE STICK ON-1.png",
        alt: "Before and after stick-on hair system result for Daljit Singh in the short hair category.",
      },
      {
        key: "short-hair-saurabh",
        name: "SAURABH MISHRA",
        variant: "stick-on",
        quote: "Exactly the kind of natural look I was hoping for. Loved the result.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/SAURABH MISHRA DESKTOP STICK ON-1.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/SAURABH MISHRA MOBILE STICK ON-1.png",
        alt: "Before and after stick-on hair system result for Saurabh Mishra in the short hair category.",
      },
      {
        key: "short-hair-rohit",
        name: "ROHIT CHOUDHARY",
        variant: "stick-on",
        quote: "I was looking for something subtle, and this is perfect. It adds volume without looking too heavy.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/ROHIT CHOUDHARY DESKTOP STICK ON-1.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/ROHIT CHOUDHARY MOBILE STICK ON-1.png",
        alt: "Before and after stick-on hair system result for Rohit Choudhary in the short hair category.",
      },
    ] satisfies ResultsRealPeopleItem[],
  },
  mediumHair: {
    label: "Medium Hair",
    items: [
      {
        key: "medium-hair-advik",
        name: "ADVIK SHARMA",
        variant: "clip-on",
        quote: "My hair finally looks fuller without looking fake. That’s the best part.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/ADVIK SHARMA DESKTOP CLIP ON-1.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/ADVIK SHARMA MOBILE CLIP ON-1.png",
        alt: "Before and after clip-on hair system result for Advik Sharma in the medium hair category.",
      },
      {
        key: "medium-hair-rylan",
        name: "RYLAN RODRIGUES",
        variant: "clip-on",
        quote: "The volume looks so natural, not overdone at all. Exactly what I wanted.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/RYLAN RODRIGUES DESKTOP CLIP ON-1.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/RYLAN RODRIGUES MOBILE CLIP ON-1.png",
        alt: "Before and after clip-on hair system result for Rylan Rodrigues in the medium hair category.",
      },
      {
        key: "medium-hair-manish",
        name: "MANISH YADAV",
        variant: "stick-on",
        quote: "The texture and finish are flawless. It’s exactly what I needed for a more confident look.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/MANISH YADAV DESKTOP STICK ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/MANISH YADAV MOBILE STICK ON.png",
        alt: "Before and after stick-on hair system result for Manish Yadav in the medium hair category.",
      },
      {
        key: "medium-hair-nikhil",
        name: "NIKHIL PAWAR",
        variant: "stick-on",
        quote: "The result is even better than I expected. It’s comfortable, looks natural, and feels great.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/NIKHIL PAWAR DESKTOP STICK ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/NIKHIL PAWAR MOBILE STICK ON.png",
        alt: "Before and after stick-on hair system result for Nikhil Pawar in the medium hair category.",
      },
      {
        key: "medium-hair-rahil",
        name: "RAHIL KHAN",
        variant: "clip-on",
        quote: "The transformation is amazing. It feels light, comfortable, and completely natural.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/RAHIL KHAN DESKTOP CLIP ON-1.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/RAHIL KHAN MOBILE CLIP ON-1.png",
        alt: "Before and after clip-on hair system result for Rahil Khan in the medium hair category.",
      },
      {
        key: "medium-hair-pankaj",
        name: "PANKAJ BHATIA",
        variant: "clip-on",
        quote: "The hair looks fuller without being too bulky. It’s exactly the natural look I wanted.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/PANKAJ BHATIA DESKTOP CLIP ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/PANKAJ BHATIA MOBILE CLIP ON.png",
        alt: "Before and after clip-on hair system result for Pankaj Bhatia in the medium hair category.",
      },
      {
        key: "medium-hair-sahil",
        name: "SAHIL KHAN",
        variant: "clip-on",
        quote: "It feels so light and looks completely natural. I’m very satisfied.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/SAHIL KHAN DESKTOP CLIP ON-1.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/SAHIL KHAN MOBILE clip on.png",
        alt: "Before and after clip-on hair system result for Sahil Khan in the medium hair category.",
      },
    ] satisfies ResultsRealPeopleItem[],
  },
  longHair: {
    label: "Long Hair",
    items: [
      {
        key: "long-hair-chandan",
        name: "CHANDAN SINGH",
        variant: "stick-on",
        quote: "I didn’t expect it to look this real. It blends perfectly with my natural hair.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/CHANDAN SINGH DESKTOP STICK ON-1.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/CHANDAN SINGH MOBILE STICK ON-1.png",
        alt: "Before and after stick-on hair system result for Chandan Singh in the long hair category.",
      },
      {
        key: "long-hair-sanjay",
        name: "SANJAY KUMAR",
        variant: "stick-on",
        quote: "I was worried it would look obvious, but it blends seamlessly. The comfort is unmatched.",
        desktopSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/SANJAY KUMAR DESKTOP STICK ON.png",
        mobileSrc: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/SANJAY KUMAR MOBILE STICK ON.png",
        alt: "Before and after stick-on hair system result for Sanjay Kumar in the long hair category.",
      },
    ] satisfies ResultsRealPeopleItem[],
  },
} as const;

export const RESULTS_REAL_PEOPLE_FILTER_ORDER: ResultsRealPeopleFilterKey[] = [
  "all",
  "lowDensity",
  "highDensity",
  "shortHair",
  "mediumHair",
  "longHair",
];

export const RESULTS_REAL_PEOPLE_FILTER_LABELS: Record<ResultsRealPeopleFilterKey, string> = {
  all: "All",
  lowDensity: RESULTS_REAL_PEOPLE_FILTERS.lowDensity.label,
  highDensity: RESULTS_REAL_PEOPLE_FILTERS.highDensity.label,
  shortHair: RESULTS_REAL_PEOPLE_FILTERS.shortHair.label,
  mediumHair: RESULTS_REAL_PEOPLE_FILTERS.mediumHair.label,
  longHair: RESULTS_REAL_PEOPLE_FILTERS.longHair.label,
};
