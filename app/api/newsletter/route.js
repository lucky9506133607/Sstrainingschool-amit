import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import clientPromise, { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().email("A valid email is required").max(254),
});

export async function GET() {
  return Response.json({ ok: true, service: "newsletter" });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "A valid email is required" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();

  try {
    const client = await clientPromise;
    const db = getDb(client);
    const col = db.collection("newsletter_subscribers");
    const existing = await col.findOne({ email });
    if (existing) {
      return Response.json({ ok: true, already: true }, { status: 200 });
    }
    await col.insertOne({ id: uuidv4(), email, createdAt: new Date(), source: "newsletter" });
    return Response.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Newsletter save failed", { message: err.message });
    return Response.json({ error: "Could not subscribe. Please try again." }, { status: 500 });
  }
}
