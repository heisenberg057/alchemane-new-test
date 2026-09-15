export interface AlchemaneVideoAsset {
  src: string;
  poster: string;
  width: number;
  height: number;
  ariaLabel: string;
}

export interface AlchemaneTrustItem {
  icon: string;
  width: number;
  height: number;
  label: string;
  suffix?: string;
}

export interface AlchemanePersonaItem {
  icon: string;
  text: string;
}

export interface AlchemaneBenefitItem {
  strong: string;
  text: string;
}

export interface AlchemaneCompareRow {
  feature: string;
  other: string;
  us: string;
}

export interface AlchemaneMethodItem {
  video: AlchemaneVideoAsset;
  label?: string;
}

export interface AlchemaneFaqItem {
  question: string;
  answer: string;
  open?: boolean;
}

export interface AlchemaneFaqTab {
  id: string;
  label: string;
  items: AlchemaneFaqItem[];
}

export interface AlchemaneLocationPhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
  wide?: boolean;
}
