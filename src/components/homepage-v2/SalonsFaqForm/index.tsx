'use client';

import './SalonsFaqForm.css';
import Salons from './Salons';
import Faq from './Faq';
import Form from './Form';

/** Step 7: designer Salons + Faq + Form (replaces Locations + FAQ + ContactForm). */
export default function SalonsFaqForm() {
  return (
    <>
      <Salons />
      <Faq />
      <Form />
    </>
  );
}
