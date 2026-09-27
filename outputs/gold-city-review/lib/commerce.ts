export type CheckoutResult =
  { status: "unavailable"; message: string } | { status: "ready"; url: string };
export interface CommerceProvider {
  createCheckout(productSlug: string): Promise<CheckoutResult>;
}
export const commerce: CommerceProvider = {
  async createCheckout() {
    return {
      status: "unavailable",
      message: "This collection is not available for purchase yet.",
    };
  },
};
