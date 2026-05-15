import React, { useEffect, useState, memo, useRef } from "react";
import { api } from "@/lib/api";

const partners = [
  "Vertex",
  "Radical Minds",
  "1 Point 1 Solutions",
  "Fair Product India",
  "Vayu",
  "Conveline",
  "Formula Machinery",
  "Aryan Hospital",
  "Shriram Electricals",
  "Anosh Electricals & Hardware",
];

export function TrustedBy() {
  const [companies, setCompanies] = useState<string[]>(partners);

  const rootRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!rootRef.current) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        }
      },
      { root: null, threshold: 0.1 },
    );

    obs.observe(rootRef.current);

    return () => {
      cancelled = true;
      obs.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;

    const loadPartners = async () => {
      try {
        const data = await api.hiringPartners.list();

        if (cancelled) return;

        if (Array.isArray(data)) {
          if (data.length > 0 && typeof data[0] === "object") {
            setCompanies(data.map((item: any) => item.name || item.id));
          } else {
            setCompanies(partners);
          }
        }
      } catch (err: any) {
        if (cancelled) return;
        // fallback to static partners
        setCompanies(partners);
      }
    };

    loadPartners();

    return () => {
      cancelled = true;
    };
  }, [visible]);

  return (
    <section className="border-y border-border bg-card/50 py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Trusted Partners
          </span>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Trusted by leading companies</h2>

          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            We are actively working with reputed companies and hiring partners across multiple
            industries including BPO, healthcare, technology, electricals, manufacturing, and
            logistics.
          </p>
        </div>

        <div
          ref={(el) => (rootRef.current = el as HTMLElement)}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {companies.map((company) => (
            <div
              key={company}
              className="flex h-20 items-center justify-center rounded-xl border border-border bg-background px-4 text-center text-sm font-bold tracking-tight text-muted-foreground grayscale transition-all hover:border-primary/40 hover:bg-card hover:text-primary hover:grayscale-0 hover:shadow-sm"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(TrustedBy);
