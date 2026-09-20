// Type-only contract. No values or runtime export. Never import commercial records into client code.
export interface InternalPricingRecord {
  packageId: string;
  internalPricingStatus: "unreviewed" | "draft" | "approved";
  estimatedHours: number | null;
  internalCost: number | null;
  contractorCost: number | null;
  softwareCost: number | null;
  thirdPartyCost: number | null;
  targetGrossMargin: number | null;
  minimumPrice: number | null;
  recommendedPrice: number | null;
  rushMultiplier: number | null;
}
// Future implementation belongs behind authenticated, staff-authorized server access.
