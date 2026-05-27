import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

let stripe: Stripe;

if (stripeKey) {
  stripe = new Stripe(stripeKey, {
    apiVersion: "2024-10-28",
  });
} else {
  // Create a dummy Stripe client for build-time
  stripe = new Stripe("sk_test_dummy", {
    apiVersion: "2024-10-28",
  });
}

export { stripe };
