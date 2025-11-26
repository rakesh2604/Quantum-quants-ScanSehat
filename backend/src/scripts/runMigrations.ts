import mongoose from "mongoose";
import { config } from "../config";
import { AccessSession } from "../models/AccessSession";
import { ensureTTL } from "../utils/ttlIndex";
import { logger } from "../utils/logger";

const run = async () => {
  await mongoose.connect(config.MONGO_URI);
  await ensureTTL(AccessSession, "expiresAt", config.SESSION_TTL_MIN);
  logger.info("TTL indexes ensured");
  await mongoose.disconnect();
};

run().catch((error) => {
  logger.error({ error }, "Migration failed");
  process.exit(1);
});

