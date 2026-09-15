# Frontend Integration Layer

This folder contains the frontend application for American Hairline, built with Next.js 16 and React 19.

## 🚀 Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env.local` and fill in values (see **Environment Setup** below).

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## Environment Setup

| Variable | Purpose |
| -------- | ------- |
| `DATABASE_URL` | PostgreSQL connection string for Payload; local dev may fall back to SQLite via `src/lib/env.ts`. |
| `REDIS_URL` | Redis for BullMQ (SEO analysis jobs), rate limiting, optional IP blocking, and cache. |
| `OPENROUTER_API_KEY` | API key for OpenRouter (AI SEO and related features). |
| `GOOGLE_PAGESPEED_API_KEY` | Google PageSpeed Insights API key for Lighthouse-based SEO scoring. |
| `RESEND_API_KEY` | Resend API key for transactional email. |
| `RESEND_FROM_EMAIL` | Verified sender address used with Resend. |
| `PAYLOAD_SECRET` | Secret key Payload uses to sign tokens and encrypt sensitive values. |
| `NEXTAUTH_SECRET` | Secret NextAuth uses to sign JWT sessions (admin login). |
| `NEXTAUTH_URL` | Public base URL of the app for NextAuth callbacks (use HTTPS in production). |
| `GDPR_TOKEN_SECRET` | Secret for signing GDPR data-export / deletion tokens (can mirror `PAYLOAD_SECRET`). |
| `NEXT_PUBLIC_APP_URL` | Public site origin for links, Open Graph, sitemap, and email footers. |
| `NEXT_PUBLIC_API_URL` | Browser-visible API path or URL (usually `/api`). |
| `ADMIN_EMAIL` | Operations / security contact email used by server-side notifications. |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID for `gtag`. |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID. |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Meta (Facebook) Pixel ID for conversion tracking. |
| `BLOCKED_IPS` | Optional comma-separated IPs blocked at the edge when Redis is configured. |
| `NEXT_PUBLIC_SERVER_URL` | Optional server base URL for some admin dashboard links. |

---

## 📂 Folder Structure (Integration Layer)

The integration logic is isolated in `src/lib/`:

*   **`api/`**: Low-level API services.
    *   `client.ts`: Axios instance with interceptors for Auth headers and Token Refresh.
    *   `*.service.ts`: Module-specific API calls (e.g., `posts.service.ts`, `auth.service.ts`).
*   **`hooks/`**: React Query hooks for data fetching.
    *   `usePosts.ts`, `useProducts.ts`, etc.: Custom hooks wrapping the services.
    *   `useAuth.ts`: Hooks for auth state (`useRequireAuth`, `useRequireRole`).
*   **`store/`**: Global state management.
    *   `authStore.ts`: Zustand store for User and Access Token.
*   **`types/`**: TypeScript definitions for API responses and models.
*   **`utils/`**: Helper functions.
    *   `errorHandler.ts`: Standardized error parsing for toast notifications.

---

## 🔐 Authentication Flow

1.  **Login**: User calls `authService.login()`.
    *   Backend returns `{ accessToken, user }`.
    *   Frontend stores `accessToken` in Zustand (memory) and persists User in localStorage.
    *   Backend sets `refreshToken` in an HTTP-only cookie.
2.  **Requests**: `apiClient` interceptor attaches `Authorization: Bearer {accessToken}` to every request.
3.  **Token Expiry (401)**:
    *   Interceptor detects 401 error.
    *   Pauses pending requests.
    *   Calls `POST /api/auth/refresh-token` (using cookie).
    *   If successful: Updates `accessToken`, retries original request.
    *   If failed: Logs out user and redirects to login.

---

## 🛠️ How to Use Hooks

**Fetching Data:**
```tsx
import { usePosts } from '@/lib/hooks/usePosts';

export default function BlogPage() {
  const { data, isLoading, error } = usePosts({ page: 1, category: 'news' });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div>
      {data.posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

**Mutating Data (Create/Update):**
```tsx
import { useCreatePost } from '@/lib/hooks/usePosts';
import { useToast } from '@/ui/use-toast';

export default function CreatePostForm() {
  const { mutate, isPending } = useCreatePost();
  const { toast } = useToast();

  const handleSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Post created!' });
      },
      onError: (err) => {
        // Error is already parsed by hook/service usually, or handle here
      }
    });
  };
}
```

## ➕ How to Add a New API Endpoint

1.  **Update Service**: Add function to `src/lib/api/{module}.service.ts`.
    ```ts
    getNewFeature: async (id) => handleResponse(apiClient.get(`/feature/${id}`))
    ```
2.  **Create/Update Hook**: Add hook to `src/lib/hooks/use{Module}.ts`.
    ```ts
    export const useNewFeature = (id) => useQuery({ queryKey: ['feature', id], ... })
    ```
3.  **Use Component**: Import hook in your UI component.
