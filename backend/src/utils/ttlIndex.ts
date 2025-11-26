import { Model } from "mongoose";

export const ensureTTL = async (model: Model<any>, field: string, minutes: number) => {
  const ttlSeconds = minutes * 60;
  const indexes = await model.listIndexes();
  const exists = indexes.find((idx) => idx.name === `${field}_ttl_idx`);
  if (!exists) {
    await model.collection.createIndex({ [field]: 1 }, { expireAfterSeconds: ttlSeconds, name: `${field}_ttl_idx` });
  }
};
