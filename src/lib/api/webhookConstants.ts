/** Static presets for the integrations page. Only includes supported services. */
export const INTEGRATION_PRESETS: Record<string, Record<string, unknown>> = {
  n8n: {
    name: "n8n Workflow",
    method: "POST",
    events: ["form.submitted"],
    headers: {},
    payload: null,
    instructions: `1. Open your n8n instance at https://n8n.amankhan.space
2. Create a new workflow and add a "Webhook" trigger node
3. Set the HTTP method to POST
4. Copy the webhook URL from n8n and paste it in the URL field above
5. Activate the workflow in n8n, then save and test this webhook`,
  },
  pabbly: {
    name: "Pabbly Connect",
    method: "POST",
    events: ["form.submitted"],
    headers: {},
    payload: null,
    instructions: `1. Log into Pabbly Connect and create a new workflow
2. Choose "Webhook" as the trigger app
3. Copy the Pabbly webhook URL and paste it in the URL field above
4. Save this webhook, then submit a test form to verify the connection`,
  },
  googleSheets: {
    name: "Google Sheets (via n8n or Pabbly)",
    method: "POST",
    events: ["form.submitted"],
    headers: {},
    payload: null,
    instructions: `Recommended: route form submissions through n8n or Pabbly to Google Sheets.
1. Create an n8n or Pabbly workflow that receives a webhook and writes to Google Sheets
2. Paste the n8n/Pabbly webhook URL in the URL field above`,
  },
};

/** The only currently supported event. Others will be added when wired up. */
export const WEBHOOK_EVENT_CATALOG: {
  name: string;
  description: string;
  samplePayload: Record<string, unknown>;
}[] = [
  {
    name: "form.submitted",
    description: "Fired when a visitor submits any form on the website",
    samplePayload: {
      id: "abc123",
      type: "contact",
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 98765 43210",
      subject: "Hair restoration enquiry",
      message: "I'd like to know more about your services.",
      city: "Mumbai",
      sourceUrl: "https://americanhairline.com/contact-us",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "hair-restoration-2025",
      utmContent: "ad-variant-b",
      utmTerm: "hair transplant mumbai",
      campaignName: "Hair Restoration Q2",
      adSetName: "Mumbai Male 25-45",
      adName: "Before After Creative",
      campaignSource: "google_ads",
      placement: "search",
      gclid: "EAIaIQobChMI...",
      fbclid: null,
    },
  },
];
