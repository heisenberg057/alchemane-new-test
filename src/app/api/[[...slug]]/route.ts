import configPromise from '@payload-config'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

/** Payload collection REST (`/api/posts`, `/api/media`, …). More specific `app/api/.../route.ts` files take precedence. */
export const GET = REST_GET(configPromise)
export const POST = REST_POST(configPromise)
export const DELETE = REST_DELETE(configPromise)
export const PATCH = REST_PATCH(configPromise)
export const PUT = REST_PUT(configPromise)
export const OPTIONS = REST_OPTIONS(configPromise)
