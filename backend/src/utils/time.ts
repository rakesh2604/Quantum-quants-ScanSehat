const unitMap: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000
};

export const expiryToMs = (value: string): number => {
  const match = value.trim().match(/^(\d+)([smhd])$/i);
  if (!match) {
    throw new Error(`Unsupported expiry format: ${value}`);
  }
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  return amount * unitMap[unit];
};

