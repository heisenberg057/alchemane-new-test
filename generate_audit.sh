#!/bin/bash
OUTPUT="docs/admin_audit_output.md"
mkdir -p docs

echo "# Admin Panel Audit" > $OUTPUT
echo "" >> $OUTPUT

FILES=(
  "src/app/admin/page.tsx"
  "src/app/admin/posts/page.tsx"
  "src/app/admin/pages/page.tsx"
  "src/app/admin/media/page.tsx"
  "src/app/admin/products/page.tsx"
  "src/app/admin/forms/page.tsx"
  "src/app/admin/leads/page.tsx"
  "src/app/admin/leads/dashboard/page.tsx"
  "src/app/admin/leads/scoring/page.tsx"
  "src/app/admin/seo/page.tsx"
  "src/app/admin/seo/keywords/page.tsx"
  "src/app/admin/seo/citations/page.tsx"
  "src/app/admin/analytics/page.tsx"
  "src/app/admin/analytics/campaigns/page.tsx"
  "src/app/admin/integrations/page.tsx"
  "src/app/admin/settings/page.tsx"
  "src/app/admin/security/page.tsx"
  "src/app/admin/layout.tsx"
  "src/components/admin/Sidebar.tsx"
  "src/lib/api/endpoints.ts"
  "src/lib/api/leads.service.ts"
  "src/lib/api/posts.service.ts"
  "src/lib/api/media.service.ts"
  "src/lib/api/security.service.ts"
  "src/lib/hooks/useLeads.ts"
  "src/lib/hooks/usePosts.ts"
  "src/lib/hooks/usePages.ts"
  "src/lib/hooks/useProducts.ts"
  "src/lib/hooks/useForms.ts"
  "src/lib/hooks/useTracking.ts"
  "src/lib/auth.ts"
  "src/middleware.ts"
  "src/payload.config.ts"
)

echo "## Specific Files requested:" >> $OUTPUT
for file in "${FILES[@]}"; do
  echo "### $file" >> $OUTPUT
  if [ -f "$file" ]; then
    echo "\`\`\`" >> $OUTPUT
    cat "$file" >> $OUTPUT
    echo "\`\`\`" >> $OUTPUT
  else
    echo "**NOT FOUND**" >> $OUTPUT
  fi
  echo "" >> $OUTPUT
done

echo "## src/app/api/ route.ts files:" >> $OUTPUT
find src/app/api -name "route.ts" | sort | while read -r file; do
  echo "### $file" >> $OUTPUT
  echo "\`\`\`" >> $OUTPUT
  cat "$file" >> $OUTPUT
  echo "\`\`\`" >> $OUTPUT
  echo "" >> $OUTPUT
done

echo "## src/collections/ .ts files:" >> $OUTPUT
find src/collections -name "*.ts" | sort | while read -r file; do
  echo "### $file" >> $OUTPUT
  echo "\`\`\`" >> $OUTPUT
  cat "$file" >> $OUTPUT
  echo "\`\`\`" >> $OUTPUT
  echo "" >> $OUTPUT
done

echo "## find src/app/admin -name \"*.tsx\" -o -name \"*.ts\" | sort:" >> $OUTPUT
echo "\`\`\`" >> $OUTPUT
find src/app/admin -name "*.tsx" -o -name "*.ts" | sort >> $OUTPUT
echo "\`\`\`" >> $OUTPUT

echo "## find src/app/api -name \"route.ts\" | sort:" >> $OUTPUT
echo "\`\`\`" >> $OUTPUT
find src/app/api -name "route.ts" | sort >> $OUTPUT
echo "\`\`\`" >> $OUTPUT

echo "Audit complete!"
