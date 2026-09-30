import { Resend } from "resend";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import clientPromise, { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  email: z.string().trim().email("A valid email is required").max(254),
  phone: z.string().trim().min(6, "A valid phone number is required").max(20),
  whatsapp: z.string().trim().max(20).optional().default(""),
  course: z.string().trim().min(1, "Please select a course").max(120),
  message: z.string().trim().max(5000).optional().default(""),
});

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function GET() {
  return Response.json({ ok: true, service: "contact" });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return Response.json({ error: first?.message || "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;
  const lead = {
    id: uuidv4(),
    fullName: data.fullName,
    email: data.email.toLowerCase(),
    phone: data.phone,
    whatsapp: data.whatsapp || data.phone,
    course: data.course,
    message: data.message || "",
    createdAt: new Date(),
    source: "website-contact",
  };

  // 1) Save the lead FIRST. If this fails, the request fails.
  try {
    const client = await clientPromise;
    const db = getDb(client);
    await db.collection("contact_leads").insertOne({ ...lead });
  } catch (err) {
    console.error("Lead save failed", { message: err.message });
    return Response.json({ error: "Could not save your request. Please try again." }, { status: 500 });
  }

  // 2) Email is best-effort — a Resend failure must NOT lose the saved lead.
  let emailSent = false;
  let confirmationSent = false;

  if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL && process.env.RESEND_FROM_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Notify the business
    try {
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: [process.env.CONTACT_EMAIL],
        replyTo: lead.email,
        subject: `New Training Enquiry — ${lead.fullName}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
            <h2 style="color:#dc2626">New Driving Training Enquiry</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:6px 0"><strong>Name:</strong></td><td>${esc(lead.fullName)}</td></tr>
              <tr><td style="padding:6px 0"><strong>Email:</strong></td><td>${esc(lead.email)}</td></tr>
              <tr><td style="padding:6px 0"><strong>Phone:</strong></td><td>${esc(lead.phone)}</td></tr>
              <tr><td style="padding:6px 0"><strong>WhatsApp:</strong></td><td>${esc(lead.whatsapp)}</td></tr>
              <tr><td style="padding:6px 0"><strong>Course:</strong></td><td>${esc(lead.course)}</td></tr>
            </table>
            <p><strong>Message:</strong></p>
            <p style="background:#f5f5f5;padding:12px;border-radius:8px">${esc(lead.message || "—").replaceAll("\n", "<br>")}</p>
            <p style="color:#888;font-size:12px">Lead ID: ${lead.id}</p>
          </div>`,
      });
      if (!error) emailSent = true;
      else console.error("Notification email rejected", { leadId: lead.id, message: error.message });
    } catch (err) {
      console.error("Notification email failed", { leadId: lead.id, message: err.message });
    }

    // Confirmation to the lead
    try {
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: [lead.email],
        subject: "Thanks for contacting SS Training School",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
            <h2 style="color:#dc2626">Thank you, ${esc(lead.fullName)}!</h2>
            <p>We have received your enquiry for <strong>${esc(lead.course)}</strong>. Our team will reach out to you shortly to confirm your training schedule.</p>
            <p>If it's urgent, call us at <strong>${esc(process.env.CONTACT_EMAIL ? "" : "")}</strong> or reply to this email.</p>
            <p style="margin-top:24px">Drive safe,<br/><strong>SS Training School</strong></p>
          </div>`,
      });
      if (!error) confirmationSent = true;
      else console.error("Confirmation email rejected", { leadId: lead.id, message: error.message });
    } catch (err) {
      console.error("Confirmation email failed", { leadId: lead.id, message: err.message });
    }
  }

  return Response.json(
    { ok: true, id: lead.id, emailSent, confirmationSent },
    { status: 201 }
  );
}
