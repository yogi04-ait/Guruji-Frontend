import { useEffect, useState, useRef } from "react";
import { Quote } from "lucide-react";
import { api } from "@/lib/api";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  designation: string;
  category: string;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    obs.observe(rootRef.current);

    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;

    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const data = await api.testimonials.list();
        if (!cancelled) setTestimonials(data);
      } catch (error) {
        if (!cancelled) console.error("Failed to fetch testimonials:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTestimonials();

    return () => {
      cancelled = true;
    };
  }, [visible]);

  if (!visible && !loading && testimonials.length === 0) {
    // Placeholder while component is offscreen to avoid eager network fetch
    return (
      <section ref={(el) => (rootRef.current = el as HTMLElement)} className="py-20" aria-hidden />
    );
  }

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted by job seekers and companies across industries.
          </p>
        </div>

        <div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          ref={(el) => (rootRef.current = el as HTMLElement)}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition"
            >
              <Quote className="w-8 h-8 text-primary mb-3" />

              <p className="text-gray-700 text-sm leading-relaxed mb-5 line-clamp-4">
                "{testimonial.quote}"
              </p>

              <div>
                <h4 className="font-semibold text-base">{testimonial.name}</h4>

                <p className="text-xs text-gray-500 mt-1">
                  {testimonial.designation} · {testimonial.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        {!loading && testimonials.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No testimonials found.</p>
        )}
      </div>
    </section>
  );
}
