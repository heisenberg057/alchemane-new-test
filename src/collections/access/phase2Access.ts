import type { CollectionConfig } from "payload";

type CollectionAccess = NonNullable<CollectionConfig["access"]>;

function roleOf(user: unknown): string {
  if (!user || typeof user !== "object") return "";
  const role = (user as { role?: unknown }).role;
  return typeof role === "string" ? role.toUpperCase() : "";
}

export function isAdminRole(user: unknown): boolean {
  const role = roleOf(user);
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isContentRole(user: unknown): boolean {
  const role = roleOf(user);
  return role === "ADMIN" || role === "SUPER_ADMIN" || role === "EDITOR";
}

/**
 * Tracking collections are written only by trusted server routes
 * (`overrideAccess: true`). Public Payload REST create is closed.
 * Read/update/delete: admin only.
 */
export const trackingCollectionAccess: CollectionAccess = {
  create: () => false,
  read: ({ req: { user } }) => isAdminRole(user),
  update: ({ req: { user } }) => isAdminRole(user),
  delete: ({ req: { user } }) => isAdminRole(user),
};

/** ADMIN or SUPER_ADMIN role required for all operations */
export const adminOnlyAccess: CollectionAccess = {
  read: ({ req: { user } }) => isAdminRole(user),
  create: ({ req: { user } }) => isAdminRole(user),
  update: ({ req: { user } }) => isAdminRole(user),
  delete: ({ req: { user } }) => isAdminRole(user),
};

/** Public read; ADMIN/SUPER_ADMIN/EDITOR write */
export const publicReadContentWriteAccess: CollectionAccess = {
  read: () => true,
  create: ({ req: { user } }) => isContentRole(user),
  update: ({ req: { user } }) => isContentRole(user),
  delete: ({ req: { user } }) => isContentRole(user),
};

/** @deprecated Use publicReadContentWriteAccess — kept as alias for older imports */
export const publicReadAdminWriteAccess = publicReadContentWriteAccess;

/** Leads / inbox: admin-only; public creates go through custom routes + overrideAccess */
export const leadsAdminAccess: CollectionAccess = {
  read: ({ req: { user } }) => isAdminRole(user),
  create: () => false,
  update: ({ req: { user } }) => isAdminRole(user),
  delete: ({ req: { user } }) => isAdminRole(user),
};

/** Immutable logs: admin read; no public/authenticated delete */
export const immutableAdminReadAccess: CollectionAccess = {
  read: ({ req: { user } }) => isAdminRole(user),
  create: () => false,
  update: () => false,
  delete: () => false,
};
