import configPromise from '@payload-config'
import { getPayload } from 'payload'
import dotenv from 'dotenv'

dotenv.config()

const seed = async () => {
  const payload = await getPayload({ config: configPromise })

  console.log('Seeding database...')

  // Create Posts
  await payload.create({
    collection: 'posts',
    data: {
      title: '5 Myths About Hair Transplants',
      slug: '5-myths-about-hair-transplants',
      category: 'hair-transplant',
      publishedDate: new Date().toISOString(),
      content: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'text',
                  text: 'Many people believe hair transplants are painful and leave visible scars. In this article, we debunk these myths.',
                  version: 1,
                },
              ],
            },
          ],
        },
      },
    },
  })

  await payload.create({
    collection: 'posts',
    data: {
      title: 'Why Stick-on Hair Systems are Better than Wigs',
      slug: 'why-stick-on-better-than-wigs',
      category: 'hair-systems',
      publishedDate: new Date().toISOString(),
      content: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'text',
                  text: 'Stick-on systems offer a secure fit and natural look that traditional wigs simply cannot match.',
                  version: 1,
                },
              ],
            },
          ],
        },
      },
    },
  })

  await payload.create({
    collection: 'posts',
    data: {
      title: 'How to Maintain Your Hair System',
      slug: 'how-to-maintain-hair-system',
      category: 'general-care',
      publishedDate: new Date().toISOString(),
      content: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'text',
                  text: 'Proper maintenance is key to extending the life of your hair system. Follow these simple steps.',
                  version: 1,
                },
              ],
            },
          ],
        },
      },
    },
  })

  // Create Form Submissions
  await payload.create({
    collection: 'form-submissions',
    data: {
      type: 'contact',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9876543210',
      message: 'I am interested in a consultation for a hair transplant.',
      sourceUrl: '/contact-us',
    },
  })

  await payload.create({
    collection: 'form-submissions',
    data: {
      type: 'consultation',
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      phone: '9123456780',
      message: 'Do you offer EMI options for the stick-on system?',
      sourceUrl: '/stick-on-vs-clip-on',
    },
  })
  
  await payload.create({
    collection: 'form-submissions',
    data: {
      type: 'callback',
      name: 'Sneha Gupta',
      email: 'sneha.g@example.com',
      phone: '8888888888',
      message: 'Please call me back regarding SMP pricing.',
      sourceUrl: '/smp',
    },
  })

  console.log('Seeding complete!')
  process.exit(0)
}

seed()
