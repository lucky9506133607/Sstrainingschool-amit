"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Reveal from "@/components/Reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      toast.success(
        data.already
          ? "You're already on the list!"
          : "Subscribed! Watch your inbox for tips & offers."
      );
      setEmail("");
    } catch (err) {
      toast.error(err.message || "Unable to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-16">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative grid items-center gap-8 md:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  <Mail className="h-4 w-4" /> Newsletter
                </span>
                <h2 className="font-display mt-3 text-2xl font-bold sm:text-3xl">
                  Driving tips & exclusive offers
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Join our list for seasonal discounts, new course announcements and
                  safe-driving tips. No spam, unsubscribe anytime.
                </p>
              </div>
              <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 flex-1"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 gap-2 bg-primary px-6 hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Joining...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Subscribe
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
