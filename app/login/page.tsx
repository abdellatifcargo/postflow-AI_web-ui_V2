"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  tenantSlug: z.string().min(1, "Tenant is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const parsed = loginSchema.safeParse({
        email,
        password,
        tenantSlug,
      });

      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => i.message).join(", ");
        setError(errors);
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        tenantSlug,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials or tenant");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Sign In</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tenant
            </label>
            <select
              value={tenantSlug}
              onChange={(e) => setTenantSlug(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground"
            >
              <option value="">Select a tenant</option>
              <option value="acme">ACME Corp</option>
              <option value="techcorp">TechCorp</option>
              <option value="acme">tatif</option>
              <option value="startup">StartupXYZ</option>
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
