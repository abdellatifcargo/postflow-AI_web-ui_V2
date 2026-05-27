"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">SaaS Pro</h1>
          <div className="flex gap-4">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Manage Your Social Media Business
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Streamline your multi-tenant publishing workflow with our powerful
            SaaS platform.
          </p>
          <div className="flex gap-4 justify-center">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg">Start Free Trial</Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-background rounded-lg border border-border">
              <h4 className="text-lg font-semibold mb-2">Multi-Tenant</h4>
              <p className="text-muted-foreground">
                Manage multiple organizations with complete data isolation and
                security.
              </p>
            </div>
            <div className="p-6 bg-background rounded-lg border border-border">
              <h4 className="text-lg font-semibold mb-2">Real-time Updates</h4>
              <p className="text-muted-foreground">
                See your posts update automatically every 5 seconds.
              </p>
            </div>
            <div className="p-6 bg-background rounded-lg border border-border">
              <h4 className="text-lg font-semibold mb-2">API Integration</h4>
              <p className="text-muted-foreground">
                Seamless Stripe integration for payments and subscriptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$29",
                features: [
                  "1 Tenant",
                  "Basic Analytics",
                  "Email Support",
                ],
              },
              {
                name: "Pro",
                price: "$99",
                features: [
                  "Unlimited Tenants",
                  "Advanced Analytics",
                  "Priority Support",
                  "API Access",
                ],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: [
                  "Everything in Pro",
                  "Dedicated Account Manager",
                  "Custom Integrations",
                  "SLA",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-lg border ${
                  plan.highlighted
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <h4 className="text-2xl font-bold mb-2">{plan.name}</h4>
                <p className="text-3xl font-bold mb-6">{plan.price}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="text-muted-foreground">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  Choose Plan
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 SaaS Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
