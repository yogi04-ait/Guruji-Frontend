import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Guruji Job Consultancy" },
      {
        name: "description",
        content:
          "Get in touch with Guruji Job Consultancy in Delhi NCR / Gurgaon. Call, email, or send us a message — we'll respond within 48 business hours.",
      },
      // Open Graph
      { property: "og:title", content: "Contact — Guruji Job Consultancy" },
      {
        property: "og:description",
        content:
          "Take the first step towards your career growth. Reach our team in Gurgaon, Delhi NCR.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "http://www.gjc.services/contact" },
      { property: "og:image", content: "http://www.gjc.services/og-image.jpg" },
      // Twitter / X Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Contact — Guruji Job Consultancy" },
      {
        name: "twitter:description",
        content: "Reach Guruji Job Consultancy in Gurgaon, Delhi NCR for placement or hiring.",
      },
      { name: "twitter:image", content: "http://www.gjc.services/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "http://www.gjc.services/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children:
          '{"@context":"https://schema.org","@type":"ContactPage","name":"Contact Guruji Job Consultancy","description":"Get in touch with Guruji Job Consultancy in Gurgaon, Delhi NCR.","url":"http://www.gjc.services/contact","mainEntity":{"@type":"LocalBusiness","name":"Guruji Job Consultancy","telephone":"+91-92170-10815","email":"guruji.jobconsultancy@gmail.com","address":{"@type":"PostalAddress","addressLocality":"Gurugram","addressRegion":"Haryana","addressCountry":"IN"}}}',
      },
    ],
  }),
  component: ContactPage,
});

const contacts = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 92170 10815",
    href: "tel:+919217010815",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 74287 00215",
    href: "tel:+917428700215",
  },
  {
    icon: Mail,
    label: "Email",
    value: "guruji.jobconsultancy@gmail.com",
    href: "mailto:guruji.jobconsultancy@gmail.com",
  },
  { icon: MapPin, label: "Location", value: "Gurgaon, Delhi NCR" },
];

type EnquiryCategory = "job seeker" | "employer" | "other";

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState<EnquiryCategory>("other");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await api.enquiries.create({
        name,
        email,
        phone,
        message,
        category,
      });

      toast.success("Enquiry submitted successfully");

      setSubmitted(true);

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setCategory("other");
    } catch (error: any) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to submit enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageHero
        eyebrow="Contact"
        title="Get in touch today"
        description="Take the first step towards your career growth — or hire skilled candidates for your next role. Reach our team directly; we typically respond within 48 business hours."
      />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
          <div className="space-y-4">
            {contacts.map((c, index) => (
              <a
                key={`${c.label}-${index}`}
                href={c.href}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <c.icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </p>

                  <p className="mt-1 text-base font-semibold text-foreground">{c.value}</p>
                </div>
              </a>
            ))}

            <div className="rounded-2xl bg-gradient-hero p-6 text-primary-foreground">
              <h3 className="text-lg font-bold">Office Hours</h3>

              <p className="mt-2 text-sm text-primary-foreground/85">Monday – Saturday</p>

              <p className="text-sm text-primary-foreground/85">10:00 AM – 6:00 PM IST</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-border bg-card p-8 shadow-sm lg:p-10"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
                  <CheckCircle2 className="h-8 w-8 text-accent" />
                </div>

                <h3 className="mt-5 text-2xl font-bold">Thank you!</h3>

                <p className="mt-2 max-w-sm text-muted-foreground">
                  We've received your message and will get back to you within 48 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm font-medium text-primary hover:underline"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold">Send us a message</h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Tell us about your goal — finding a job or hiring talent — and we'll take it from
                  there.
                </p>

                <div className="mt-7 grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Full Name"
                      name="name"
                      required
                      placeholder="Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />

                    <Field
                      label="Phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      I am a
                    </label>

                    <select
                      name="type"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EnquiryCategory)}
                      required
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="job seeker">Job Seeker</option>
                      <option value="employer">Employer / Hiring Manager</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Message
                    </label>

                    <textarea
                      name="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      placeholder="Tell us a little about what you're looking for..."
                      className="mt-1.5 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-all hover:bg-primary-glow hover:shadow-large disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? "Sending..." : "Send Message"}

                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </section>
    </Layout>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>

      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
