import { getMediaUrl } from '@/lib/media/cdn';

export type Salon = {
  city: string;
  address: string;
  images: string[];
  alt: string;
  href: string;
};

export const salonsTitle = ['Walk Into Any Of', 'Our Premium Salons'] as const;

export const salons: Salon[] = [
  {
    city: 'Mumbai',
    address: '4th floor Empressa Building, 2nd Rd, Khar West,\nMumbai, Maharashtra 400052',
    images: [
      getMediaUrl('/media/salons/mumbai/salon-1.png'),
      getMediaUrl('/media/salons/mumbai/salon-2.png'),
      getMediaUrl('/media/salons/mumbai/salon-3.png'),
    ],
    alt: 'Inside the American Hairline Mumbai salon.',
    href: 'https://maps.google.com/?q=Empressa+Building+2nd+Rd+Khar+West+Mumbai+400052',
  },
  {
    city: 'Delhi',
    address: 'Beau Monde, E-84, Greater Kailash 1,\nHansraj Gupta Marg, New Delhi 110048',
    images: [
      getMediaUrl('/media/salons/delhi/salon-1.jpg'),
      getMediaUrl('/media/salons/delhi/salon-2.jpg'),
    ],
    alt: 'Inside the American Hairline Delhi salon.',
    href: 'https://maps.google.com/?q=Beau+Monde+E-84+Greater+Kailash+1+Hansraj+Gupta+Marg+New+Delhi+110048',
  },
  {
    city: 'Bangalore',
    address:
      'Golden Hive, 484, 2nd Floor, Signature Square,\nChinmaya Mission Hospital Rd, Indira Nagar, Bengaluru 560038',
    images: [
      getMediaUrl('/media/salons/bangalore/salon-1.png'),
      getMediaUrl('/media/salons/bangalore/salon-2.png'),
    ],
    alt: 'Inside the American Hairline Bangalore salon.',
    href: 'https://maps.google.com/?q=Golden+Hive+Luxury+Unisex+Salon+484+2nd+Floor+Signature+Square+Circle+Chinmaya+Mission+Hospital+Rd+Indira+Nagar+1st+Stage+Bengaluru+Karnataka+560038',
  },
];

export const salonsAction = 'Get Direction';

export const salonsOutro = {
  copy: 'Three studios, one standard. Come in, see the systems, and decide with your own eyes.',
  action: 'Discuss With A Consultant',
  href: '#contact-form',
};

export type FaqItem = {
  q: string;
  a: string;
  hidden?: boolean;
};

export type FaqGroup = { id: string; label: string; items: FaqItem[] };

export const faqTitle = 'Frequently Asked Questions';

export const faqRating = { score: '4.9', label: '300+ Google reviews' };

export const faqGroups: FaqGroup[] = [
  {
    id: 'consultation',
    label: 'Consultation',
    items: [
      {
        q: 'How long does the consultation take?',
        a: 'Usually 30 to 45 minutes. We take time to understand you and answer all your questions properly.',
      },
      {
        q: 'What happens in the consultation?',
        a: 'We look at your stage of hair loss, run the Advanced 3D Scan, and talk through your routine — your work, your travel, how much upkeep you actually want. Then we show you what suits you, and what does not.',
      },
      {
        q: 'Is it an in-person or online consultation?',
        a: 'Either. In person at our Mumbai, Delhi or Bangalore studios, or online if you are travelling or based abroad. The scan and the samples are the parts worth coming in for, so we will tell you honestly if a visit would serve you better.',
      },
      {
        q: 'Will I get to see real samples or demos?',
        a: 'Yes. You can hold the bases and the hair, see the density and the hairline up close, and try a system on so you are deciding from something real rather than a photograph.',
      },
      {
        q: 'Will I be pressured to buy during the consultation?',
        a: 'No. There is no upselling and nothing is decided on the day. If a hair system is not the right answer for you, we will say so — we have turned people away before.',
      },
      {
        q: 'Will I know the total cost after the consultation?',
        a: 'Yes. You leave knowing the price of the system you chose and what its servicing costs, in writing. No hidden charges appear later.',
      },
    ],
  },
  {
    id: 'hair-system',
    label: 'Hair System',
    items: [
      {
        q: 'Will it look fake?',
        a: 'No, it looks just like your real hair — even stylists cannot tell. The giveaway is always the front, which is why the hairline is custom-designed to your face and goes through the 21-point check before it reaches you.',
      },
      {
        q: 'Will it damage my hair?',
        a: 'No. The system sits on the area where hair has already gone, and your remaining hair keeps its own growth cycle. Damage comes from a badly fitted patch pulling on live hair, which is what a custom-designed system is built to avoid.',
      },
      {
        q: 'Will people notice?',
        a: 'Not if the hairline is right. That is the whole job: a natural front edge, density that matches your age and face, and a base thin enough to disappear against the scalp up close.',
      },
      {
        q: 'Will I need to shave my head?',
        a: 'Only for a stick-on system, and only the area it attaches to. A clip-on needs no shaving at all and comes off whenever you want it to.',
      },
      {
        q: 'How long does a hair replacement system last?',
        a: 'It depends on the base you choose — a thinner base looks more invisible and wears faster, a thicker one lasts longer. Your consultant will give you the life expectancy of the exact base you pick, along with the servicing it needs to reach it.',
      },
      {
        q: 'Are your hair systems itchy to the scalp?',
        a: 'They should not be. The bases are breathable and the adhesives are skin-safe. Persistent itching almost always means servicing is overdue rather than that the system does not suit you — tell us and we will look at it.',
      },
    ],
  },
];

export const faqCta = {
  title: 'Still have questions?',
  body: 'No worries, we are here to guide you. Talk to us, we will explain everything.',
  action: 'Need Guidance',
  href: '#contact-form',
};

export const formTitle = ['Fill This Form To Get The', 'Right Guidance'] as const;

export const formCities = ['Mumbai', 'Delhi', 'Bangalore', 'Somewhere else'];

export const formAction = 'Submit';

export const formDone = {
  title: 'Thank you — we have your details.',
  body: 'A consultant will call you to arrange your session. Nothing is booked until you say so.',
};
