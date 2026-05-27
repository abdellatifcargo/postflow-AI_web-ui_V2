import { auth } from "@/auth";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function getTenantId() {
  const session = await auth();
  return (session?.user as any)?.tenantId;
}

export async function getTenantSlug() {
  const session = await auth();
  return (session?.user as any)?.tenantSlug;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
