import { v4 as uuidv4 } from 'uuid';
import type { Block } from '@/lib/store/useEditorStore';

function heading(text: string, level = 2, extra: Record<string, any> = {}): Block {
  return {
    id: uuidv4(),
    type: 'heading',
    props: {
      text,
      level,
      textAlign: 'left',
      color: '#111827',
      fontWeight: level === 1 ? 'extrabold' : 'bold',
      anchorId: '',
      includeInToc: true,
      ...extra,
    },
  };
}

function text(html: string, extra: Record<string, any> = {}): Block {
  return {
    id: uuidv4(),
    type: 'text',
    props: {
      text: html,
      fontSize: '16px',
      color: '#475569',
      textAlign: 'left',
      ...extra,
    },
  };
}

function button(label: string, extra: Record<string, any> = {}): Block {
  return {
    id: uuidv4(),
    type: 'button',
    props: {
      text: label,
      link: '#',
      variant: 'primary',
      size: 'lg',
      align: 'left',
      target: '_self',
      ...extra,
    },
  };
}

function section(children: Block[], extra: Record<string, any> = {}): Block {
  return {
    id: uuidv4(),
    type: 'section',
    props: {
      layout: 'stack',
      padding: '20px',
      gap: '16px',
      backgroundColor: 'transparent',
      stackOnMobile: true,
      ...extra,
    },
    children,
  };
}

function columns(count: number, childrenByColumn: Block[][], extra: Record<string, any> = {}): Block {
  return section(
    Array.from({ length: count }, (_, index) => ({
      id: uuidv4(),
      type: 'column',
      props: {
        width: `${Math.round(100 / count)}%`,
        padding: '8px',
      },
      children: childrenByColumn[index] || [],
    })),
    { layout: 'flex-row', gap: '18px', ...extra },
  );
}

export const BLOCK_PRESETS: { name: string; blocks: () => Block[] }[] = [
  {
    name: 'Blog Intro',
    blocks: () => [
      heading('Article Title', 1, { anchorId: 'article-title' }),
      text('<p>Start with a concise introduction that frames the problem, builds credibility, and tells the reader what they will learn.</p>'),
    ],
  },
  {
    name: 'Table of Contents',
    blocks: () => [
      {
        id: uuidv4(),
        type: 'toc',
        props: { title: 'In This Article', showH2: true, showH3: true, showH4: false },
      },
    ],
  },
  {
    name: 'FAQ Section',
    blocks: () => [
      heading('Frequently Asked Questions', 2, { anchorId: 'faq' }),
      {
        id: uuidv4(),
        type: 'faq',
        props: {
          items: [
            { q: 'What makes this different?', a: 'Use this answer space to explain the main differentiator in a clear, confident sentence.' },
            { q: 'How long does it take?', a: 'Set expectations with a direct answer and one supporting sentence.' },
            { q: 'What happens next?', a: 'Describe the next step so the reader knows exactly what to do.' },
          ],
        },
      },
    ],
  },
  {
    name: 'CTA Banner',
    blocks: () => [
      section(
        [
          heading('Ready to take the next step?', 2),
          text('<p>Use a strong one-line promise followed by a short action-oriented explanation.</p>'),
          button('Book Your Consultation', { align: 'left', icon: '→', iconPosition: 'right' }),
        ],
        { backgroundColor: '#fff4f7', borderRadius: '24px' },
      ),
    ],
  },
  {
    name: 'YouTube Section',
    blocks: () => [
      heading('Watch the Full Breakdown', 2),
      {
        id: uuidv4(),
        type: 'youtube',
        props: { url: '', caption: 'Paste your video URL in the inspector', aspectRatio: '16/9', lazyLoad: true },
      },
    ],
  },
  {
    name: 'Image + Caption',
    blocks: () => [
      {
        id: uuidv4(),
        type: 'image',
        props: {
          url: '',
          alt: '',
          caption: 'Add a supporting caption that explains why this image matters.',
          maxWidth: '720px',
          alignment: 'center',
          borderRadius: '20px',
          shadow: true,
        },
      },
    ],
  },
  {
    name: 'Before / After',
    blocks: () => [
      heading('Before and After', 2),
      columns(2, [
        [
          {
            id: uuidv4(),
            type: 'image',
            props: { url: '', alt: 'Before', caption: 'Before', borderRadius: '18px', shadow: true },
          },
        ],
        [
          {
            id: uuidv4(),
            type: 'image',
            props: { url: '', alt: 'After', caption: 'After', borderRadius: '18px', shadow: true },
          },
        ],
      ]),
    ],
  },
  {
    name: 'Product Comparison',
    blocks: () => [
      heading('Compare Your Options', 2),
      {
        id: uuidv4(),
        type: 'table',
        props: {
          headers: ['Feature', 'Standard', 'Premium'],
          rows: [
            ['Turnaround', '7-10 days', '3-5 days'],
            ['Support', 'Email', 'Priority phone + email'],
            ['Customization', 'Basic', 'Advanced'],
          ],
          headerRow: true,
          headerColumn: true,
          striped: true,
        },
      },
    ],
  },
  {
    name: 'Final CTA',
    blocks: () => [
      heading('Take the Next Step', 2, { textAlign: 'center' }),
      text('<p style="text-align:center">Close with a direct call to action and a short confidence-building line.</p>', { textAlign: 'center' }),
      button('Get Started Today', { align: 'center', size: 'xl', icon: '→', iconPosition: 'right' }),
    ],
  },
  {
    name: 'Testimonial',
    blocks: () => [
      {
        id: uuidv4(),
        type: 'quote',
        props: {
          text: '<p>This is where you drop a strong testimonial that sounds specific, credible, and outcome-focused.</p>',
          attribution: 'Client Name',
          borderColor: '#e31c58',
          backgroundColor: '#fff8fb',
        },
      },
    ],
  },
  {
    name: 'Quote Section',
    blocks: () => [
      heading('Expert Perspective', 2),
      {
        id: uuidv4(),
        type: 'quote',
        props: {
          text: '<p>Use a quote to add authority, emotion, or a memorable takeaway.</p>',
          attribution: 'Source Name',
          borderColor: '#002f5b',
          backgroundColor: '#f8fafc',
        },
      },
    ],
  },
  {
    name: 'Feature List',
    blocks: () => [
      heading('What You Get', 2),
      {
        id: uuidv4(),
        type: 'list',
        props: {
          ordered: false,
          items: [
            'Premium editor experience with rich formatting controls',
            'Responsive sections that stay readable on tablet and mobile',
            'Reusable blocks and templates for faster publishing',
          ],
        },
      },
    ],
  },
];
