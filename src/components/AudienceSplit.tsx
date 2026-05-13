import React, { memo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, UserSearch, Building2 } from "lucide-react";

const seekerBenefits = [
  "Personalized job matching based on your skills and goals",
  "Resume building & profile optimization support",
  "Interview preparation with mock rounds and employer insights",
  "Fast placement assistance — most candidates placed in 15 days",
];

const employerBenefits = [
  "Pre-screened, background-verified candidates",
  "Faster hiring process with structured timelines",
  "Industry-specific recruitment expertise",
  "Bulk hiring solutions for warehouses, retail, BPO and more",
];

export function AudienceSplit() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Find a Job */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm lg:p-10">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <UserSearch className="h-6 w-6" />
            </div>
            <span className="mt-5 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Find a Job
            </span>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Land a role you'll love</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Whether you're a fresher or an experienced professional, our consultants help you
              discover roles that genuinely fit your skills, salary expectations, and long-term
              ambitions — across Delhi NCR and pan-India.
            </p>
            <ul className="mt-6 space-y-3">
              {seekerBenefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-all hover:bg-primary-glow"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Hire Talent */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-soft p-8 shadow-sm lg:p-10">
          <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-accent/15 blur-2xl" />
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="mt-5 inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              Hire Talent
            </span>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Hire skilled candidates, faster</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              From single critical hires to bulk recruitment drives, we deliver pre-screened
              candidates with verified backgrounds — so your team can focus on interviews that
              actually convert into offers.
            </p>
            <ul className="mt-6 space-y-3">
              {employerBenefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-elegant transition-transform hover:scale-[1.02]"
              >
                Hire Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(AudienceSplit);
