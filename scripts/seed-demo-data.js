/**
 * Demo seed: 3 posts, 2 products, 1 settings document (key=site).
 * Usage:
 *   PAYLOAD_URL=http://localhost:3000 PAYLOAD_ADMIN_EMAIL=... PAYLOAD_ADMIN_PASSWORD=... node scripts/seed-demo-data.js
 */
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });

const BASE = process.env.PAYLOAD_URL || "http://localhost:3000";
const API = `${String(BASE).replace(/\/$/, "")}/api`;
const email = process.env.PAYLOAD_ADMIN_EMAIL;
const password = process.env.PAYLOAD_ADMIN_PASSWORD;

function lexicalParagraph(text) {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children: [
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          children: [{ type: "text", text, version: 1 }],
        },
      ],
    },
  };
}

function productDescription(text) {
  return lexicalParagraph(text);
}

const DEFAULT_SITE = {
  siteName: "American Hairline",
  siteUrl: "https://americanhairline.com",
  siteDescription: "Demo site settings",
  adminEmail: "admin@americanhairline.com",
  smtpHost: "",
  smtpPort: 587,
  emailFromName: "",
  webhookUrl: "",
  defaultMetaTitle: "",
  defaultMetaDescription: "",
  googleAnalyticsId: "",
  ai_test_models: ["perplexity-deep", "qwen-free", "perplexity-sonar"],
  ai_seo_model: "gemini-flash",
  ai_calculator_model: "gemini-pro",
};

const DEMO_POSTS = [
  {
    title: "Demo: Hair Systems 101",
    slug: "demo-hair-systems-101",
    category: "hair-systems",
    _status: "published",
    publishedDate: new Date().toISOString(),
    content: lexicalParagraph(
      "This is sample content for the admin demo. Replace with real articles."
    ),
  },
  {
    title: "Demo: General Care Tips",
    slug: "demo-general-care-tips",
    category: "general-care",
    _status: "published",
    publishedDate: new Date().toISOString(),
    content: lexicalParagraph("Short demo post body for empty database testing."),
  },
  {
    title: "Demo: Success Story Placeholder",
    slug: "demo-success-story-placeholder",
    category: "success-stories",
    _status: "published",
    publishedDate: new Date().toISOString(),
    content: lexicalParagraph("Placeholder success story content."),
  },
];

const DEMO_PRODUCTS = [
  {
    name: "Demo Hair System — Classic",
    slug: "demo-hair-system-classic",
    price: 499,
    status: "active",
    description: productDescription("Sample product for the admin catalog."),
  },
  {
    name: "Demo Maintenance Kit",
    slug: "demo-maintenance-kit",
    price: 89,
    status: "active",
    description: productDescription("Sample add-on product."),
  },
];

async function main() {
  if (!email || !password) {
    console.error("Set PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD");
    process.exit(1);
  }

  const { data: login } = await axios.post(`${API}/users/login`, { email, password });
  const loginBody = login.data ?? login;
  const token = loginBody.token || loginBody.accessToken;
  if (!token) {
    console.error("Login failed: no token", login);
    process.exit(1);
  }
  const authHeaders = { Authorization: `Bearer ${token}` };

  let created = { posts: 0, products: 0, settingsUpsert: "none" };

  for (const post of DEMO_POSTS) {
    await axios.post(`${API}/posts`, post, { headers: authHeaders });
    created.posts++;
    console.log("Created post:", post.slug);
  }

  for (const product of DEMO_PRODUCTS) {
    await axios.post(`${API}/products`, product, { headers: authHeaders });
    created.products++;
    console.log("Created product:", product.slug);
  }

  const { data: list } = await axios.get(`${API}/settings`, {
    params: { limit: 100 },
    headers: authHeaders,
  });
  const existing = (list.docs || []).find((d) => d.key === "site");
  const payload = {
    key: "site",
    value: JSON.stringify(DEFAULT_SITE),
    type: "json",
    group: "general",
  };
  if (existing?.id) {
    await axios.patch(`${API}/settings/${existing.id}`, payload, { headers: authHeaders });
    console.log("Updated settings (key=site).");
    created.settingsUpsert = "updated";
  } else {
    await axios.post(`${API}/settings`, payload, { headers: authHeaders });
    console.log("Created settings (key=site).");
    created.settingsUpsert = "created";
  }

  console.log("\nSummary:", created);
}

main().catch((err) => {
  console.error(err.response?.data || err.message);
  process.exit(1);
});
