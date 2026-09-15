/**
 * Creates the default `site` Settings row (JSON) via Payload REST API.
 * Usage:
 *   PAYLOAD_URL=http://localhost:3000 PAYLOAD_ADMIN_EMAIL=... PAYLOAD_ADMIN_PASSWORD=... node scripts/seed-settings.js
 */
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });

const BASE = process.env.PAYLOAD_URL || "http://localhost:3000";
const API = `${String(BASE).replace(/\/$/, "")}/api`;
const email = process.env.PAYLOAD_ADMIN_EMAIL;
const password = process.env.PAYLOAD_ADMIN_PASSWORD;

const DEFAULT_SITE = {
  siteName: "American Hairline",
  siteUrl: "https://americanhairline.com",
  siteDescription: "",
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

async function main() {
  if (!email || !password) {
    console.error("Set PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD");
    process.exit(1);
  }

  const { data: login } = await axios.post(`${API}/users/login`, { email, password });
  const loginBody = login.data ?? login;
  const token = loginBody.token || loginBody.accessToken;
  if (!token) {
    console.error("Login failed: no token in response", login);
    process.exit(1);
  }

  const authHeaders = { Authorization: `Bearer ${token}` };
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
    console.log("Updated existing settings row (key=site).");
  } else {
    await axios.post(`${API}/settings`, payload, { headers: authHeaders });
    console.log("Created settings row (key=site).");
  }
}

main().catch((err) => {
  console.error(err.response?.data || err.message);
  process.exit(1);
});
