import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await api.testimonials.list();
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
