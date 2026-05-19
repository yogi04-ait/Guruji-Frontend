import React, { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Target, Network, Compass, Zap, LifeBuoy, Award, Heart } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
const CtaBanner = lazy(() => import("@/components/CtaBanner"));
const TrustedBy = lazy(() => import("@/components/TrustedBy"));

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Guruji Job Consultancy in Gurgaon" },
      {
        name: "description",
        content:
          "Learn about Guruji Job Consultancy — a trusted job consultancy in Gurgaon helping job seekers and employers across Delhi NCR with personalized placement services.",
      },
      // Open Graph
      { property: "og:title", content: "About Us — Guruji Job Consultancy" },
      {
        property: "og:description",
        content:
          "The right job can change lives. Learn about our mission, values and approach to placement.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://gurujijobconsultancy.in/about" },
      { property: "og:image", content: "https://gurujijobconsultancy.in/og-image.jpg" },
      // Twitter / X Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About Us — Guruji Job Consultancy" },
      {
        name: "twitter:description",
        content: "Trusted placement services in Gurgaon and Delhi NCR. Learn about our mission.",
      },
      { name: "twitter:image", content: "https://gurujijobconsultancy.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://gurujijobconsultancy.in/about" }],
  }),
  component: AboutPage,
});

const reasons = [
  {
    icon: Network,
    title: "Strong Industry Network",
    desc: "100+ verified hiring partners across Delhi NCR, Mumbai, Bengaluru and tier-2 cities.",
  },
  {
    icon: Compass,
    title: "Personalized Guidance",
    desc: "Helping candidates connect with relevant job opportunities based on their skills and experience.",
  },
  {
    icon: Zap,
    title: "Quick Hiring Process",
    desc: "Most placements complete in 15 working days, with structured timelines and updates.",
  },
  {
    icon: LifeBuoy,
    title: "End-to-End Support",
    desc: "From first call to onboarding and the first 30 days — we stay with you throughout.",
  },
  {
    icon: Award,
    title: "Quality Over Quantity",
    desc: "Every CV we send is genuinely worth interviewing. No spray-and-pray shortlists.",
  },
  {
    icon: Heart,
    title: "Built on Relationships",
    desc: "Many of our clients and candidates come back — and refer others. That trust is everything.",
  },
];

const values = [
  {
    title: "Transparency",
    desc: "Clear updates, honest feedback, and zero hidden charges for job seekers.",
  },
  {
    title: "Speed",
    desc: "Faster shortlisting and interview cycles — without compromising on quality.",
  },
  {
    title: "Empathy",
    desc: "We treat every candidate's career and every employer's hire with genuine care.",
  },
];

function AboutPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="About Us"
        title="The right job can change lives."
        description="At Guruji Job Consultancy, we help job seekers find opportunities that match their skills and ambitions, and we help companies hire the best talent — efficiently, transparently and reliably."
      />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-3xl border border-border bg-gradient-soft p-8 lg:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-2xl font-bold sm:text-3xl">Our Mission</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              To provide reliable, fast and personalized hiring solutions that empower careers and
              strengthen organizations across India. We believe a great match between a person and a
              role creates real, lasting impact — for families, for teams, and for the country's
              growth story.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Founded in Gurgaon and serving clients across Delhi NCR and pan-India, we combine deep
              industry knowledge with a human-first approach to recruitment.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm lg:p-10">
            <h2 className="text-2xl font-bold sm:text-3xl">Who We Help</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Our consultants work with people and organizations at every stage — making sure each
              engagement gets the focus and expertise it deserves.
            </p>
            <ul className="mt-5 space-y-3 text-base text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> Freshers
                stepping into their first opportunity
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> Mid-level
                professionals seeking the next big move
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> Senior leaders
                looking for confidential, targeted searches
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> Small and
                medium businesses building strong founding teams
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> Enterprises
                hiring at scale across multiple industries
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              Why Choose Us
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Built on trust, focused on growth
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Six reasons job seekers and employers across Delhi NCR choose Guruji as their
              long-term hiring partner.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r) => (
              <div key={r.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <r.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Our Values
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">What we stand for</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border bg-card p-7 text-center shadow-sm"
            >
              <h3 className="text-xl font-bold text-primary">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Suspense fallback={<div className="py-14 lg:py-16" aria-hidden />}>
        <TrustedBy />
      </Suspense>

      <Suspense fallback={<div className="py-16 lg:py-24" aria-hidden />}>
        <CtaBanner />
      </Suspense>
    </Layout>
  );
}
