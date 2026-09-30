"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, MessageCircle, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import siteConfig, { whatsappLink } from "@/lib/siteConfig";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
  whatsapp: z.string().optional().or(z.literal("")),
  sameAsPhone: z.boolean().optional(),
  course: z.string().min(1, "Please select a course"),
  message: z.string().optional().or(z.literal("")),
});

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      whatsapp: "",
      sameAsPhone: false,
      course: "",
      message: "",
    },
  });

  const sameAsPhone = watch("sameAsPhone");
  const phone = watch("phone");

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        whatsapp: values.sameAsPhone ? values.phone : values.whatsapp || "",
        course: values.course,
        message: values.message || "",
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      toast.success("Request received! Our team will contact you shortly.");
      reset();
    } catch (e) {
      toast.error(e.message || "Unable to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: Phone, label: "Call us", value: siteConfig.phone, href: `tel:${siteConfig.phoneRaw}` },
    { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { icon: MapPin, label: "Location", value: siteConfig.address },
    { icon: Clock, label: "Hours", value: siteConfig.hours },
  ];

  return (
    <section id="contact" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Contact"
          title="Book your training today"
          subtitle="Fill in your details and we'll get you on the road with confidence."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          {/* Info panel */}
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-7">
              <div>
                <h3 className="font-display text-xl font-bold">Get in touch</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Prefer to talk? Reach us directly — we're happy to answer any questions.
                </p>
                <div className="mt-6 space-y-4">
                  {contactItems.map((c) => {
                    const content = (
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                          <c.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">{c.label}</div>
                          <div className="text-sm font-medium">{c.value}</div>
                        </div>
                      </div>
                    );
                    return c.href ? (
                      <a key={c.label} href={c.href} className="block transition-opacity hover:opacity-80">
                        {content}
                      </a>
                    ) : (
                      <div key={c.label}>{content}</div>
                    );
                  })}
                </div>
              </div>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="mt-8 block">
                <Button className="w-full gap-2 bg-[#25D366] text-black hover:bg-[#25D366]/90">
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </Button>
              </a>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal className="lg:col-span-3" delay={0.1}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-3xl border border-border bg-card p-7"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="Your name" {...register("fullName")} />
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" placeholder="Mobile number" {...register("phone")} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    placeholder="WhatsApp number"
                    disabled={sameAsPhone}
                    value={sameAsPhone ? phone : undefined}
                    {...register("whatsapp")}
                  />
                </div>
              </div>

              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <Controller
                  control={control}
                  name="sameAsPhone"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => {
                        field.onChange(v);
                        if (v) setValue("whatsapp", phone || "");
                      }}
                    />
                  )}
                />
                Same as mobile number
              </label>

              <div className="mt-5 grid gap-5">
                <div className="space-y-2">
                  <Label>Course / Training Type *</Label>
                  <Controller
                    control={control}
                    name="course"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {siteConfig.courseOptions.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.course && <p className="text-xs text-destructive">{errors.course.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us your preferred timings or any questions..."
                    {...register("message")}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-6 h-12 w-full gap-2 bg-primary text-base hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Book Your Training
                  </>
                )}
              </Button>
            </form>
          </Reveal>
        </div>

        <Reveal className="mt-8" delay={0.1}>
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Find us in Lucknow</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.mapQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="ml-auto text-xs font-medium text-primary hover:underline"
              >
                Open in Google Maps
              </a>
            </div>
            <iframe
              title="SS Training School location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.mapQuery)}&output=embed`}
              className="h-72 w-full border-0 grayscale-[0.2] md:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
