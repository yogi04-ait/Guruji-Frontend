import React, { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  Search,
  MessageSquare,
  Briefcase,
  Users,
  Layers,
  UserCheck,
  Factory,
  CheckCircle2,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
const CtaBanner = lazy(() => import("@/components/CtaBanner"));
const AudienceSplit = lazy(() => import("@/components/AudienceSplit"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Job Placement & Recruitment in Delhi NCR" },
      {
        name: "description",
        content:
          "Resume building, job matching, interview prep, placement assistance, candidate sourcing, bulk hiring and senior recruitment — placement services in Delhi NCR.",
      },
      // Open Graph
      { property: "og:title", content: "Services — Guruji Job Consultancy" },
      {
        property: "og:description",
        content:
          "Tailored placement and recruitment services for job seekers and employers across industries in Gurgaon and Delhi NCR.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://gurujijobconsultancy.in/services" },
      { property: "og:image", content: "https://gurujijobconsultancy.in/og-image.jpg" },
      // Twitter / X Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Services — Guruji Job Consultancy" },
      {
        name: "twitter:description",
        content: "Placement and recruitment services for job seekers and employers in Delhi NCR.",
      },
      { name: "twitter:image", content: "https://gurujijobconsultancy.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://gurujijobconsultancy.in/services" }],
  }),
  component: ServicesPage,
});

const seekers = [
  {
    icon: FileText,
    title: "Resume Building & Guidance",
    desc: "Professional, role-targeted resumes that pass ATS filters and get noticed by hiring managers.",
  },
  {
    icon: Search,
    title: "Job Matching by Skills",
    desc: "Hand-picked roles aligned to your strengths, experience, location and salary expectations.",
  },
  {
    icon: MessageSquare,
    title: "Interview Preparation",
    desc: "Mock interviews, employer-specific insights, and confidence coaching before every round.",
  },
  {
    icon: Briefcase,
    title: "Placement Assistance",
    desc: "End-to-end support through offer negotiation, onboarding paperwork and your first 30 days.",
  },
];

const employers = [
  {
    icon: UserCheck,
    title: "Skilled Candidate Sourcing",
    desc: "Pre-screened, background-verified talent matched precisely to your role requirements.",
  },
  {
    icon: Users,
    title: "Bulk Hiring Solutions",
    desc: "Volume recruitment for warehouses, BPO, retail and manufacturing — with structured SLAs.",
  },
  {
    icon: Layers,
    title: "Mid & Senior-Level Hiring",
    desc: "Confidential specialist search for managerial, leadership and CXO roles.",
  },
  {
    icon: Factory,
    title: "Industry-Specific Recruitment",
    desc: "Sector experts who understand your business, your competition and your talent landscape.",
  },
];

function ServiceCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof FileText;
  title: string;
  desc: string;
}) {
  return (
    <div className="group flex gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-elegant">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function ServicesPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Our Services"
        title="Smarter hiring. Stronger careers."
        description="We offer dedicated services for job seekers and employers across Delhi NCR — built around real outcomes, transparent timelines and long-term relationships, not just resumes."
      />

      <Suspense fallback={<div className="py-20" aria-hidden />}>
        <AudienceSplit />
      </Suspense>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              Detailed Services
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Everything we do, in one place</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              A complete breakdown of our offerings — for individuals chasing the right role and for
              companies hiring skilled candidates.
            </p>
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-10">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 items-center rounded-full bg-primary/10 px-3 text-xs font-semibold uppercase tracking-wider text-primary">
                  For Job Seekers
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-bold sm:text-3xl">Find your next opportunity</h3>
              <p className="mt-3 text-muted-foreground">
                From your first job out of college to your next senior move — we walk with you. Our
                consultants invest time in understanding your goals before pitching any role.
              </p>
              <div className="mt-8 grid gap-4">
                {seekers.map((s) => (
                  <ServiceCard key={s.title} {...s} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 items-center rounded-full bg-accent/15 px-3 text-xs font-semibold uppercase tracking-wider text-accent">
                  For Employers
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-bold sm:text-3xl">Hire the right people, faster</h3>
              <p className="mt-3 text-muted-foreground">
                Quality candidates, structured processes, accountable delivery. Whether you need one
                critical hire or fifty warehouse staff — we scale to your need.
              </p>
              <div className="mt-8 grid gap-4">
                {employers.map((s) => (
                  <ServiceCard key={s.title} {...s} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm lg:p-12">
          <h3 className="text-2xl font-bold sm:text-3xl">What's included with every engagement</h3>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Every client and candidate gets the same baseline of care — regardless of role level or
            hiring volume.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Dedicated consultant point of contact",
              "Transparent updates and weekly reporting",
              "Background-verified candidate profiles",
              "Replacement guarantee on placements",
              "Pan-India sourcing reach",
              "Strict confidentiality and data protection",
            ].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Suspense fallback={<div className="py-20" aria-hidden />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<div className="py-16" aria-hidden />}>
        <CtaBanner />
      </Suspense>
    </Layout>
  );
}
