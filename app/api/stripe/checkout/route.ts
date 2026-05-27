import { requireAuth, getTenantId } from "@/lib/auth-helpers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const PLANS = {
  starter: {
    name: "Starter",
    price: 2900,
    priceId: process.env.STRIPE_PRICE_ID_STARTER || "",
  },
  pro: {
    name: "Pro",
    price: 9900,
    priceId: process.env.STRIPE_PRICE_ID_PRO || "",
  },
};

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const tenantId = await getTenantId();

    if (!tenantId) {
      return new Response(JSON.stringify({ error: "No tenant" }), {
        status: 400,
      });
    }

    const body = await request.json();
    const { plan } = body;

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), {
        status: 400,
      });
    }

    const planConfig = PLANS[plan as keyof typeof PLANS];

    // Create or get Stripe customer
    let customerId: string;

    const existingCustomer = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (existingCustomer.data.length > 0) {
      customerId = existingCustomer.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { tenantId },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: { tenantId },
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
