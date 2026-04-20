import Stripe from "stripe";
import { env } from "~/env";

export const stripe = new Stripe(env.STRIPE_PRIVATE_KEY, {
  apiVersion: "2025-01-27.acacia", // Use a stable API version
  typescript: true,
});
