import React, { memo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 shadow-large lg:p-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-primary-glow/40 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-balance text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
              Take the first step towards your career growth.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              Whether you're searching for the right role or building a winning team, we're here to
              help — with personalized support every step of the way.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:flex-col">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-card px-6 py-3.5 text-sm font-semibold text-primary shadow-elegant transition-transform hover:scale-[1.02]"
            >
              Get in Touch <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3.5 text-sm font-semibold text-primary-foreground backdrop-blur transition-colors hover:bg-primary-foreground/20"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(CtaBanner);
