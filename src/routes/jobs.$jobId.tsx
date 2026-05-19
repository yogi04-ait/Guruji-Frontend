import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { api } from "@/lib/api";
import {
  Building2,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Loader2,
  Send,
  CheckCircle2,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner"; // Using sonner for toasts as seen in package.json
import validator from "validator";

export const Route = createFileRoute("/jobs/$jobId")({
  // Server-side loader so head() can produce dynamic per-job SEO meta
  loader: async ({ params }) => {
    try {
      const data = await api.companies.jobdetails(params.jobId);

      const item = data?.data || data;
      const [error, setError] = useState<string | null>(null);

      if (!item) return { job: null };

      return {
        job: {
          ...item,
          id: item._id || item.id,
        },
      };
    } catch (error) {
      console.error(error);
      return { job: null };
    }
  },
  head: ({ loaderData }) => {
    const job = loaderData?.job;
    if (!job) {
      return {
        meta: [
          { title: "Apply for Job — Guruji Job Consultancy" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${job.role || "Job Opening"} at ${job.name} — Guruji Job Consultancy`;
    const description = [
      job.role ? `Apply for ${job.role}` : "Apply for this opening",
      job.name ? `at ${job.name}` : "",
      job.location ? `in ${job.location}` : "",
      job.experience ? `| Experience: ${job.experience}` : "",
      "Apply through Guruji Job Consultancy.",
    ]
      .filter(Boolean)
      .join(" ");
    const canonicalUrl = `https://gurujijobconsultancy.in/jobs/${job.id}`;
    const jobPostingLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: job.role || "Job Opening",
      description: job.description || description,
      hiringOrganization: {
        "@type": "Organization",
        name: job.name,
      },
      ...(job.location && {
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location,
            addressCountry: "IN",
          },
        },
      }),
      ...(job.salary && {
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: "INR",
          value: {
            "@type": "QuantitativeValue",
            unitText: "YEAR",
            description: job.salary,
          },
        },
      }),
      ...(job.openings != null && { totalJobOpenings: job.openings }),
      employmentType: "FULL_TIME",
      datePosted: new Date().toISOString().split("T")[0],
      validThrough: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      url: canonicalUrl,
      directApply: true,
    });
    return {
      meta: [
        { title },
        { name: "description", content: description },
        // Open Graph
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: "https://gurujijobconsultancy.in/og-image.jpg" },
        // Twitter / X Card
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: "https://gurujijobconsultancy.in/og-image.jpg" },
        { name: "robots", content: "index, follow" },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: jobPostingLd,
        },
      ],
    };
  },
  component: JobDetailsPage,
});

type Company = {
  _id: string;
  name: string;
  industry: string | null;
  location: string | null;
  role: string | null;
  experience: string | null;
  openings: number | null;
  description: string | null;
  salary?: string | null;
  working_hours?: string | null;
  shift_timing?: string | null;
  working_days?: string | null;
  skills?: string | null;
  apply_url?: string | null;
  status: "active" | "closed" | "archived";
};

function JobDetailsPage() {
  const { jobId } = Route.useParams();
  const [job, setJob] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const found = await api.companies.jobdetails(jobId);
        if (found) {
          setJob(found.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    setSubmitting(true);

    try {
      const isValid: boolean = validator.isEmail(formData.email);
      if (!isValid) {
        toast.error("Please enter a valid email address.");
        return;
      }

      await api.companies.apply(job._id, {
        ...formData,
        companyName: job.name,
        jobRole: job.role || "General Application",
      });
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        message: "",
      });
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !job) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center px-5">
          <h2 className="text-2xl font-bold">Job Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The job you are looking for does not exist or is no longer active.
          </p>
          <Link
            to="/hiring"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Hiring
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        eyebrow="Job Details"
        title={job.role || job.name}
        description={`Apply for the ${job.role || "open"} role at ${job.name}.`}
      />

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <Link
          to="/hiring"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all jobs
        </Link>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Job Details Column */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary border border-border">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {job.role || "General Application"}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{job.name}</span>
                  {job.industry && (
                    <>
                      <span>•</span>
                      <span>{job.industry}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {job.location && (
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm">
                  <MapPin className="h-4 w-4 text-primary" /> {job.location}
                </div>
              )}
              {job.experience && (
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm">
                  <Clock className="h-4 w-4 text-primary" /> {job.experience}
                </div>
              )}
              {job.openings != null && (
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm">
                  <Users className="h-4 w-4 text-primary" /> {job.openings} Opening
                  {job.openings === 1 ? "" : "s"}
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm">
                  <Briefcase className="h-4 w-4 text-primary" /> {job.salary}
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Additional Job Metadata (if available from API) */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {(job.salary || job.working_hours || job.shift_timing || job.working_days) && (
                  <div className="col-span-full border-t border-border pt-6 pb-2">
                    <h3 className="text-lg font-bold mb-4">Role Overview</h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 sm:grid-cols-3">
                      {job.salary && (
                        <div>
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            CTC
                          </p>
                          <p className="mt-1 font-medium">{job.salary}</p>
                        </div>
                      )}
                      {job.working_hours && (
                        <div>
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Working Hours
                          </p>
                          <p className="mt-1 font-medium">{job.working_hours}</p>
                        </div>
                      )}
                      {job.shift_timing && (
                        <div>
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Shift Timing
                          </p>
                          <p className="mt-1 font-medium">{job.shift_timing}</p>
                        </div>
                      )}
                      {job.working_days && (
                        <div>
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Working Days
                          </p>
                          <p className="mt-1 font-medium">{job.working_days}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="text-lg font-bold">Job Description</h3>
                {job.description ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    No detailed description provided for this role.
                  </p>
                )}
              </div>

              {job.skills && (
                <div className="border-t border-border pt-6 space-y-4">
                  <h3 className="text-lg font-bold">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.split(",").map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-sm font-medium text-secondary-foreground"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Application Form Column */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Apply Now</h3>

              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                  </div>
                  <h4 className="text-lg font-semibold">Application Received</h4>
                  <p className="text-sm text-muted-foreground">
                    Thank you for applying to {job.name}. Our team will review your application and
                    get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-sm font-medium text-primary hover:underline"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Company</label>
                    <input
                      type="text"
                      value={job.name}
                      disabled
                      className="flex h-10 w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground opacity-70 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Role Applied For</label>
                    <input
                      type="text"
                      value={job.role || "General Application"}
                      disabled
                      className="flex h-10 w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground opacity-70 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium leading-none">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Priya Sharma"
                      className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="priyasharma@gmail.com"
                      className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium leading-none">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium leading-none">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us why you are a good fit for this role..."
                      className="flex min-h-[100px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Submit Application
                      </>
                    )}
                  </button>
                  {/* <p className="text-xs text-center text-muted-foreground mt-4">
                    By applying, you agree to our terms and privacy policy.
                  </p> */}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
