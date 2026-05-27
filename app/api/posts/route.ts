import { requireAuth, getTenantId } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    await requireAuth();
    const tenantId = await getTenantId();

    if (!tenantId) {
      return new Response(JSON.stringify({ error: "No tenant" }), {
        status: 400,
      });
    }

    const posts = await prisma.post.findMany({
      where: { tenantId },
      include: { author: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
