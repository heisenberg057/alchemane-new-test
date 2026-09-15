'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'

export const SocialPreview: React.FC = () => {
  const metaTitle = useFormFields(([fields]) => fields['meta.title']?.value as string)
  const metaDescription = useFormFields(([fields]) => fields['meta.description']?.value as string)
  const postTitle = useFormFields(([fields]) => fields['title']?.value as string)

  const displayTitle = metaTitle || postTitle || 'Post Title'
  const displayDescription = metaDescription || 'Post description will appear here. This is a preview of how your content will look when shared on social media.'

  return (
    <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f7fa', borderRadius: '8px', border: '1px solid #e1e4e8' }}>
      <h4 style={{ marginBottom: '15px', color: '#2A3547' }}>Search & Social Preview</h4>
      
      {/* Google Preview */}
      <div style={{ marginBottom: '25px' }}>
        <p style={{ fontSize: '12px', color: '#70757a', marginBottom: '4px' }}>Google Search</p>
        <div style={{ color: '#1a0dab', fontSize: '18px', marginBottom: '4px', textDecoration: 'none', cursor: 'pointer' }}>{displayTitle}</div>
        <div style={{ color: '#006621', fontSize: '14px', marginBottom: '4px' }}>https://americanhairline.com/blog/...</div>
        <div style={{ color: '#4d5156', fontSize: '14px', lineHeight: '1.4' }}>{displayDescription}</div>
      </div>

      {/* Facebook Preview */}
      <div style={{ border: '1px solid #dddfe2', borderRadius: '3px', overflow: 'hidden', maxWidth: '500px' }}>
        <div style={{ height: '260px', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
           <span style={{ color: '#aaa' }}>Image Preview</span>
        </div>
        <div style={{ padding: '12px', backgroundColor: '#f2f3f5' }}>
          <div style={{ color: '#606770', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>AMERICANHAIRLINE.COM</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1c1e21', marginBottom: '4px' }}>{displayTitle}</div>
          <div style={{ color: '#606770', fontSize: '14px', lineHeight: '1.3' }}>{displayDescription}</div>
        </div>
      </div>
    </div>
  )
}
