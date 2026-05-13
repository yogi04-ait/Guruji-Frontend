import React, { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Shirt, Stethoscope, Cpu, ShoppingBag, Truck, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
const CtaBanner = lazy(() => import("@/components/CtaBanner"));
const TrustedBy = lazy(() => import("@/components/TrustedBy"));

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries We Serve — Recruitment Across Sectors in India" },
      {
        name: "description",
        content:
          "Specialist recruitment across Manufacturing, Garments & Textile, Healthcare, IT & BPO, Retail and Logistics — placement services in Delhi NCR and pan-India.",
      },
      // Open Graph
      { property: "og:title", content: "Industries We Serve — Guruji Job Consultancy" },
      {
        property: "og:description",
        content: "Deep recruitment expertise across the sectors that drive India forward.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "http://www.gjc.services/industries" },
      { property: "og:image", content: "http://www.gjc.services/og-image.jpg" },
      // Twitter / X Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Industries We Serve — Guruji Job Consultancy" },
      {
        name: "twitter:description",
        content:
          "Specialist recruitment across Manufacturing, Healthcare, IT, Retail, Logistics in India.",
      },
      { name: "twitter:image", content: "http://www.gjc.services/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "http://www.gjc.services/industries" }],
  }),
  component: IndustriesPage,
});

const industries = [
  {
    icon: Building2,
    name: "Manufacturing",
    desc: "Plant operations, production, quality assurance, maintenance and engineering roles for OEMs and component makers.",
    roles: ["Production Engineer", "Plant Operators", "Machine Operator", "Supervisor"],
  },
  {
    icon: Shirt,
    name: "Garments & Textile",
    desc: "Merchandising, production, sampling and export-oriented hiring for buying houses, factories and brands.",
    roles: ["Garment Designer", "Garment Technologist", "General Manager", "Sampling Coordinator"],
  },
  {
    icon: Stethoscope,
    name: "Healthcare",
    desc: "Clinical, allied health, and hospital administration talent for hospitals, diagnostics and pharma companies.",
    roles: ["Staff Nurse", "Lab Technician", "Hospital Administrator"],
  },
  {
    icon: Cpu,
    name: "IT & BPO",
    desc: "Software developers, technical support, voice & non-voice processes, and tech operations across scales.",
    roles: ["Software Engineer", "Customer Support", "Tech Lead"],
  },
  {
    icon: ShoppingBag,
    name: "Retail",
    desc: "Store leadership, sales associates, visual merchandising and back-office support for offline and D2C brands.",
    roles: ["Store Manager", "Sales Executive", "Visual Designer"],
  },
  {
    icon: Truck,
    name: "Logistics",
    desc: "Warehousing, supply chain, fleet operations and last-mile delivery teams — including bulk hiring drives.",
    roles: ["Warehouse Supervisor", "Fleet Manager", "Delivery Associate"],
  },
];

function IndustriesPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Industries We Serve"
        title="Specialists across sectors"
        description="A focused team for every industry — so candidates and employers speak the same language from day one. Sector experts based in Gurgaon, hiring across India."
      />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <div
              key={i.name}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/5 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-elegant">
                  <i.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-bold">{i.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.desc}</p>
                <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
                  {i.roles.map((r) => (
                    <li
                      key={r}
                      className="flex items-center gap-2 text-xs font-medium text-foreground"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Don't see your industry?</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            We've completed successful searches in BFSI, Real Estate, Education, Hospitality, FMCG,
            Automotive and more. If you have a hiring need, our team will tell you honestly whether
            we're the right fit — before you commit to anything.
          </p>
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
