# Backend System Plan: Next.js + PayloadCMS Integration

## 1. Executive Summary

To achieve a **WordPress/Shopify-like** experience with **full control** and **seamless integration** into your existing Next.js codebase, I recommend integrating **PayloadCMS 3.0**.

**Why PayloadCMS?**

* **Native Next.js Integration**: It runs directly within your existing Next.js application (no need for a separate server).

* **Visual Admin Panel**: Provides a professional dashboard (at `/admin`) for managing blogs, forms, and SEO, similar to WordPress.

* **Full Control**: Defined entirely in code (TypeScript), allowing us to customize logic, hooks, and data structures precisely.

* **Own Your Data**: You host the database (PostgreSQL), giving you complete ownership and tracking capabilities.

## 2. System Architecture

```HTML
graph TD
    User[User / Visitor] -->|Visits Website| Frontend[Next.js Frontend]
    Admin[Admin / You] -->|Manages Content| CMS[Payload Admin Panel (/admin)]
    
    subgraph "Next.js Application (Monorepo)"
        Frontend
        CMS
        API[Backend API Routes]
    end
    
    Frontend -->|Fetches Content| API
    CMS -->|Updates Content| Database[(PostgreSQL Database)]
    API -->|Reads/Writes| Database
    
    Frontend -->|Submits Forms| API
    API -->|Triggers| Webhooks[Webhooks / Email Service]
```

## 3. Tech Stack

* **Frontend**: Next.js 14+ (Existing)

* **Backend / CMS**: PayloadCMS 3.0 (Beta/Stable)

* **Database**: PostgreSQL (Recommended provider: **Neon** or **Supabase** for serverless scaling).

* **Object Storage**: AWS S3 or Supabase Storage (for uploading blog images/media).

* **Email Service**: Resend (for form submission notifications).

## 4. Feature Breakdown

### A. Blog Management System

We will create a **CMS Collection** named `Posts`.

* **Features**:

  * **Rich Text Editor**: For writing articles with headings, images, and formatting (Lexical editor).

  * **Categories & Tags**: Relational fields to organize content.

  * **Authors**: Link posts to specific team members.

  * **Draft/Publish System**: Work on drafts before going live.

### B. Form Submissions & Tracking

We will create a **CMS Collection** named `Form Submissions`.

* **Workflow**:

  1. User submits a form on the website.
  2. Data is sent to the internal API.
  3. Data is saved to the `Form Submissions` collection in the database (Permanent Record).
  4. **Hooks**: On creation, the system triggers:

     * **Email Notification**: Sends details to your admin email via Resend.

     * **Tracking**: Logs the event source (e.g., "Contact Page", "Footer").

### C. SEO & Content Management

We will create a **Global Setting** for Site Metadata and add SEO fields to all Pages.

* **Global**: Default Site Title, Suffix, Favicon, OG Image.

* **Per-Page/Post**:

  * Meta Title & Description.

  * Open Graph (Social) Image.

  * Canonical URL.

  * Structured Data (JSON-LD) injection.

### D. System Event Tracking

To satisfy the "track everything" requirement, we will implement a custom **Audit Log**.

* **Collection**: `System Events`

* **What it tracks**:

  * Content updates (Who edited what and when).

  * Form submissions.

  * Login events.

  * Error logs.

* **Admin View**: You can view these logs directly in the Admin Panel.

## 5. Data Flow & Responsibilities

| Feature    | Frontend Responsibility         | Backend (Payload) Responsibility              | Data Storage       |
| :--------- | :------------------------------ | :-------------------------------------------- | :----------------- |
| **Blog**   | Fetch & Display Posts (ISR/SSG) | Provide API, Admin UI, Image optimization     | PostgreSQL + S3    |
| **Forms**  | Validation, UI Experience       | API Endpoint, Sanitization, Storage, Emailing | PostgreSQL         |
| **SEO**    | Render Meta Tags in `<head>`    | Store & Manage SEO fields per page            | PostgreSQL         |
| **Images** | `next/image` Rendering          | Upload handling, resizing                     | S3 / Cloud Storage |

## 6. Implementation Phases

### Phase 1: Infrastructure Setup (No Code Changes Yet)

1. **Database**: Set up a PostgreSQL project (e.g., on Neon.tech).
2. **Storage**: Set up an S3-compatible bucket (e.g., R2, AWS, or Supabase).
3. **Environment**: Define `.env` variables (DB\_URI, PAYLOAD\_SECRET).

### Phase 2: Payload Integration

1. Install PayloadCMS packages into `american-hairline`.
2. Create `payload.config.ts` to define the system structure.
3. Set up the `/admin` route.

### Phase 3: Content Modeling

1. Define `Media` collection (for images).
2. Define `Posts` collection (for blog).
3. Define `FormSubmissions` collection.

### Phase 4: API Integration

1. Connect Frontend Blog pages to fetch data from Payload.
2. Connect Frontend Forms to submit data to Payload.

## 7. Immediate Next Steps

To proceed, I need your approval on this architecture.
**Do you agree with using PayloadCMS + PostgreSQL to keep the "WordPress-like" experience within your Next.js app?**
Once confirmed, I will start by installing the necessary dependencies and configuring the database connection.
