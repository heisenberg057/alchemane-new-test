/**
 * Create an admin user via POST /api/users.
 * Requires the Next.js app to be running (e.g. npm run dev).
 *
 * To reset a password or create a user without a running server, use instead:
 *   npm run create-admin-sqlite -- <email> <password> [role]
 *
 * Usage:
 *   node scripts/create-admin-user.js <email> <password> [role]
 *   PAYLOAD_URL=http://localhost:3000 node scripts/create-admin-user.js admin@example.com 'Secret123' SUPER_ADMIN
 *
 * Role: SUPER_ADMIN | ADMIN | EDITOR (default: SUPER_ADMIN)
 */
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env.local") });
dotenv.config({ path: path.join(__dirname, "../.env") });

const BASE = process.env.PAYLOAD_URL || "http://localhost:3000";
const API = `${String(BASE).replace(/\/$/, "")}/api`;

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const role = (process.argv[4] || "SUPER_ADMIN").toUpperCase();

  if (!email || !password) {
    console.error(
      "Usage: node scripts/create-admin-user.js <email> <password> [SUPER_ADMIN|ADMIN|EDITOR]"
    );
    process.exit(1);
  }

  try {
    const { data } = await axios.post(
      `${API}/users`,
      { email, password, role },
      { validateStatus: () => true, timeout: 15000 }
    );

    if (data?.success) {
      console.log("OK:", data.message || "User created", data.data);
      process.exit(0);
    }

    const msg = data?.message || data?.errors || JSON.stringify(data);
    console.error("Create failed:", msg);

    if (
      String(msg).toLowerCase().includes("duplicate") ||
      String(msg).toLowerCase().includes("already") ||
      data?.errors?.[0]?.message?.includes("email")
    ) {
      console.error(
        "\nThis email may already exist. Options:\n" +
          "  • Log in with the password you used when creating it\n" +
          "  • Or reset the password in Payload Admin (/admin if enabled) or delete the row in users and run this script again."
      );
    }
    process.exit(1);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error(
        "Request failed:",
        e.message,
        e.response?.status,
        e.response?.data
      );
      if (e.code === "ECONNREFUSED") {
        console.error(
          "\nStart the app first: cd AmericanHairline-Unified && npm run dev"
        );
      }
    } else {
      console.error(e);
    }
    process.exit(1);
  }
}

main();
