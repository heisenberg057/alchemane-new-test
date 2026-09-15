import { getPayloadSingleton } from "../lib/api/getPayload";
import { bulkScoreAllLeads } from "../lib/services/leadScoring.service";

async function main() {
  console.log("Starting manual scoring...");
  try {
    const payload = await getPayloadSingleton();
    const result = await bulkScoreAllLeads();
    console.log(`Scoring finished: ${result.scored} scored, ${result.failed} failed.`);
    process.exit(0);
  } catch (err) {
    console.error("Scoring failed:", err);
    process.exit(1);
  }
}

main();
