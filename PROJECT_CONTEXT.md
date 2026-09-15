# American Hairline Project Context (End-to-End)

> **Last Updated:** 2026-02-26
> **Status:** Active Development (Handover Phase)

## 1. Project Overview
**American Hairline** is a premium hair replacement system provider. This project is a full-stack web application comprising:
- **Marketing Website**: High-performance, SEO-optimized public facing pages.
- **Admin Dashboard**: Comprehensive CMS for managing Posts, Media, and SEO.
- **Backend API**: Specialized Express.js server handling data, images, and content.

## 2. Architecture & Tech Stack

### **Frontend (The Website & Admin)**
*   **Framework**: Next.js 15+ (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, Shadcn UI (Radix Primitives)
*   **State Management**: React Query (TanStack Query) v5
*   **Forms**: React Hook Form + Zod Validation
*   **Icons**: Lucide React
*   **Editor**: **Editor.js** (Block-based content editing)
    *   **Wrappers**: Custom `BlockEditor.tsx` with dynamic imports (No-SSR).
    *   **Plugins**: `@editorjs/header`, `@editorjs/list`, `@editorjs/image`, `@editorjs/quote`, `@editorjs/delimiter`.
*   **Hosting**: **Vercel** (Auto-deploys from `master` branch).

### **Backend (The API)**
*   **Runtime**: Node.js 18+
*   **Framework**: Express.js
*   **Database**: PostgreSQL (via Supabase)
*   **ORM**: Prisma
*   **Hosting**: **Railway** (Auto-deploys from `main` branch of `backend/` root).
*   **Authentication**: JWT (Access/Refresh Tokens).

## 3. Critical Repositories & URLs
| Resource | URL | Notes |
| :--- | :--- | :--- |
| **Frontend Repo** | `https://github.com/ghost-of-sparta-aman/ahl-testing-website` | **Repo Root** |
| **Frontend Live** | `https://ahl-testing-deployment.vercel.app` | |
| **Backend Live** | `https://ahl-testing-website-production.up.railway.app` | |
| **Admin Login** | `https://ahl-testing-deployment.vercel.app/admin/login` | |
| **Health Check** | `https://ahl-testing-website-production.up.railway.app/health` | Returns `{ "status": "ok" }` |
| **Manual Migration** | `https://ahl-testing-website-production.up.railway.app/api/public-migrate` | **USE THIS** instead of CLI migrations |

## 4. Git Workflow & Branch Strategy (CRITICAL)
The project uses a **Divergent Branch Strategy** within a single repository.
**Strict Rule**: **TEST LOCALLY FIRST**. Never push code that hasn't been verified on `localhost`.

### **Branch Map**
| Branch | Content | Deploys To |
| :--- | :--- | :--- |
| **`master`** | **Frontend Code** (Next.js) | **Vercel** (Automatic) |
| **`main`** | **Backend Code** (Express/Prisma) | **Railway** (Automatic) |

### **Development Workflow**
1.  **Code & Implement**: Make changes in your local environment.
2.  **Local Testing (MANDATORY)**:
    *   **Frontend**: Run `npm run dev`, check `localhost:3000`, verify UI and Console logs.
    *   **Backend**: Run `npm run dev`, check `localhost:3000/api`, verify API responses.
    *   **Build Check**: Run `npm run build` locally to catch TypeScript/Lint errors before pushing.
3.  **Push to Deploy**:
    *   To update **Website**: `git push origin master`
    *   To update **Backend**: `git push origin main`
4.  **Monitor**:
    *   Check Vercel Dashboard for Frontend build status.
    *   Check Railway Dashboard for Backend build/deploy logs.

## 5. Deployment & Configuration Quirks (CRITICAL)
*   **React 19 & Payload CMS**:
    *   We use `.npmrc` with `legacy-peer-deps=true` to resolve conflicts between React 19 and Payload CMS.
    *   **Payload Version**: Pinned to `3.74.0` in `package.json`. **DO NOT CHANGE** without careful testing.
*   **Railway Port & Startup**:
    *   Application listens on **Port 3000**.
    *   `prisma db push` is **removed** from the start command to prevent timeouts.
    *   **Configuration**: `railway.json` is present.
*   **Vercel Builds**:
    *   `vercel.json` is present to force builds on `master` (overriding "Ignored Build Step").

## 6. Feature Status: Block Editor (Recently Completed)
**Status**: Backend Live, Frontend Pushed to Master.

### **Backend Infrastructure**
*   **Database**: Added `blocksData` (String) to `Post` model in Prisma to store structured JSON from Editor.js.
*   **API Updates**: `createPost` and `updatePost` endpoints now handle and persist `blocksData`.
*   **Autosave**: Implemented `PATCH /api/posts/:id/autosave` for lightweight, real-time saving (skips heavy SEO analysis).
*   **Media Upload**: Created `POST /api/media/editor-upload` returning the specific URL format required by Editor.js.
*   **Migration**: Deployed via `/api/public-migrate` utility to patch production DB without data loss.

### **Frontend Integration**
*   **Component**: `BlockEditor.tsx` created as a robust React wrapper.
    *   **Dynamic Import**: Prevents SSR errors common with Editor.js.
    *   **Autosave**: Triggers silent backend calls while typing.
    *   **Image Integration**: Drag-and-drop images in editor upload directly to Cloudinary via backend.
*   **Form**: `PostForm.tsx` updated to replace legacy RichText editor with `BlockEditor`.
*   **Type Safety**: Fixed TypeScript errors in `Post` interfaces and API definitions.

## 7. Pending Tasks (Immediate Action Items)
The following issues need to be resolved in the next session:

### **1. Delete Post Error (Database)**
*   **Issue**: Deleting a post fails due to Foreign Key constraint on `AiCitationTest`.
*   **Fix**: Update `prisma/schema.prisma` to add `onDelete: Cascade` to the `AiCitationTest` relation.
    ```prisma
    model AiCitationTest {
      post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
      // ...
    }
    ```
*   **Action**: Apply change and run migration (via SQL patch if needed).

### **2. Refresh Token Crash (Backend)**
*   **Issue**: Backend crashes with an "undefined" error in the auth controller during token refresh.
*   **Fix**: Debug `src/controllers/auth.controller.js` to ensure safe property access when handling refresh tokens.

### **3. Editor Enhancements (Frontend)**
*   **Add Tables**: Install `@editorjs/table` and configure in `BlockEditor.tsx`.
*   **Add Embeds**: Install `@editorjs/embed` for YouTube/Twitter support.
*   **Media Picker**: Integrate the existing `MediaLibrary` modal into the Editor to allow selecting existing images instead of just uploading new ones.

### **4. Image Upload Fix (Frontend)**
*   **Issue**: Editor uploads might fail if the `Authorization` header isn't passed correctly.
*   **Fix**: Ensure `BlockEditor.tsx` passes the auth token in the upload config `config: { additionalRequestHeaders: { Authorization: ... } }`.

## 8. Secrets & Keys
*   **Git User**: `ghost-of-sparta-aman`
*   **SSH Key**: `~/.ssh/id_ed25519`
*   **GitHub Token**: `<PROVIDE_IN_PROMPT>`
*   **Railway Token**: `<PROVIDE_IN_PROMPT>`
*   **Vercel Token**: `<PROVIDE_IN_PROMPT>`

## 9. Troubleshooting Guide
*   **Railway 404 / "Train not arrived"**:
    *   Check if the service is listening on **Port 3000**.
    *   Ensure the domain is correctly linked in Railway settings.
*   **Vercel "Ignored Build Step"**:
    *   Check `vercel.json`. It should force the build for `master`.
*   **npm `ERESOLVE` Errors**:
    *   Always use `legacy-peer-deps=true` (configured in `.npmrc`).
    *   Do not upgrade `@payloadcms/*` packages blindly.

## 10. How to Resume Work
1.  **Start New Chat**: Upload this file (`PROJECT_CONTEXT.md`) as the primary context.
2.  **Pull Latest Code**: `git pull origin master` (for Frontend) or `git pull origin main` (for Backend).
3.  **Start Task**: Begin with **"Delete Post Error"** (Task #1 above).
