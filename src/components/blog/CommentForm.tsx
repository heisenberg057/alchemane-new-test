'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useSiteSettings } from '@/lib/hooks/useSiteSettings';

interface CommentFormProps {
  postId: number;
}

export function CommentForm({ postId }: CommentFormProps) {
  const { data: site } = useSiteSettings();
  const router = useRouter();
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    authorUrl: '',
    content: '',
    saveInfo: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  if (site && site.blogCommentsEnabled === false) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          authorName: formData.authorName,
          authorEmail: formData.authorEmail,
          authorUrl: formData.authorUrl,
          content: formData.content,
          turnstileToken: turnstileToken!,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit comment');
      }

      setStatus('success');
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      setFormData({
        authorName: formData.saveInfo ? formData.authorName : '',
        authorEmail: formData.saveInfo ? formData.authorEmail : '',
        authorUrl: formData.saveInfo ? formData.authorUrl : '',
        content: '',
        saveInfo: formData.saveInfo,
      });
      
      // Refresh server component data to show the new comment without a full page reload
      setTimeout(() => router.refresh(), 1500);

    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 text-green-800 p-6 rounded-lg my-8 text-center border border-green-200">
        <h3 className="font-bold text-lg mb-2">Thank you!</h3>
        <p>Your comment has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 my-10">
      <h3 className="text-2xl font-bold mb-6">Leave a Reply</h3>
      <p className="text-gray-500 mb-6 text-sm">Your email address will not be published. Required fields are marked *</p>
      
      {status === 'error' && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <textarea
            required
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4686fe] focus:border-transparent resize-none"
            placeholder="Write your comment here... *"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4686fe] focus:border-transparent"
            placeholder="Name *"
            value={formData.authorName}
            onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
          />
          <input
            type="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4686fe] focus:border-transparent"
            placeholder="Email *"
            value={formData.authorEmail}
            onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
          />
          <input
            type="url"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4686fe] focus:border-transparent"
            placeholder="Website"
            value={formData.authorUrl}
            onChange={(e) => setFormData({ ...formData, authorUrl: e.target.value })}
          />
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="saveInfo"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-[#4686fe]"
              checked={formData.saveInfo}
              onChange={(e) => setFormData({ ...formData, saveInfo: e.target.checked })}
            />
          </div>
          <label htmlFor="saveInfo" className="ml-2 text-sm font-medium text-gray-600">
            Save my name, email, and website in this browser for the next time I comment.
          </label>
        </div>

        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
          onError={() => setTurnstileToken(null)}
        />

        <button
          type="submit"
          disabled={status === 'loading' || !turnstileToken}
          className="px-8 py-3 bg-[#4686fe] text-white font-bold rounded-md hover:bg-[#2f6fe6] transition-colors shadow-md disabled:opacity-70"
        >
          {status === 'loading' ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}
