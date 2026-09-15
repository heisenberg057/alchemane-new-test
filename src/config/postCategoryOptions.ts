export const POST_CATEGORY_OPTIONS = [
  { label: 'Hair Transplant', value: 'hair-transplant' },
  { label: 'Hair Systems',    value: 'hair-systems'    },
  { label: 'General Care',    value: 'general-care'    },
  { label: 'Success Stories', value: 'success-stories' },
] as const

export const POST_CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  POST_CATEGORY_OPTIONS.map((o) => [o.value, o.label])
)
