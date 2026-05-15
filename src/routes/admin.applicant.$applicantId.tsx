import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { api } from "@/lib/api";
import { ArrowLeft, Building2, MapPin, Clock, Users, Loader2, Briefcase } from "lucide-react";

export const Route = createFileRoute("/admin/applicant/$applicantId")({
  head: () => ({
    meta: [
      { title: "Applicant Details — Admin Dashboard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ApplicantDetailsPage,
});

type JobInfo = {
  _id?: string;
  id?: string;
  name?: string;
  role?: string;
  industry?: string;
  location?: string;
  experience?: string;
  openings?: number;
  salary?: string;
  working_days?: string;
  working_hours?: string;
  description?: string;
  status?: string;
  shift_timing?: string | null;
  skills?: string | null;
};

type ApplicantDetails = {
  id: string;
  fullName: string;
  applicantStatus?: string;
  email?: string;
  phone?: string;
  message?: string;
  createdAt?: string;
  job?: JobInfo;
};

const APPLICANT_STATUSES = ["new", "reviewed", "shortlisted", "rejected"] as const;

type ApplicantStatus = (typeof APPLICANT_STATUSES)[number];

function ApplicantDetailsPage() {
  const { applicantId } = Route.useParams() as { applicantId: string };
  const navigate = useNavigate();

  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [item, setItem] = useState<ApplicantDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState<ApplicantStatus>("new");

  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await api.auth.me();
        setIsAdmin(true);
        setAuthChecked(true);
        await load();
      } catch (err: any) {
        navigate({ to: "/admin/login" });
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantId]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.applicants.get(applicantId);
      if (res?.applicantStatus) {
        setStatus(res.applicantStatus);
      }
      setItem(res || null);
    } catch (err: any) {
      console.error("Failed to load applicant details:", err);
      if (err.response?.status === 401) navigate({ to: "/admin/login" });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (value: ApplicantStatus) => {
    setStatus(value);
  };

  const updateStatus = async (status: ApplicantStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await api.applicants.updateStatus(applicantId, status);
      console.log("Status update response:", res);
    } catch (err: any) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingStatus(false);
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

  if (!authChecked) {
    return (
      <Layout>
        <div className="p-20 text-center text-muted-foreground">Loading…</div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="mx-auto max-w-md p-12 text-center">
          <h1 className="text-2xl font-bold">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account doesn't have admin privileges.
          </p>
        </div>
      </Layout>
    );
  }

  const job = item?.job || null;

  return (
    <Layout>
      <PageHero
        eyebrow="Applicant Details"
        title={job?.role || job?.name || "Application"}
        description={item ? `${item.fullName} — ${item.applicantStatus || "Status unknown"}` : ""}
      />

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="mb-6">
          <button
            onClick={() => navigate({ to: "/admin/applicants" })}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to applicants
          </button>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Job Details (left/main) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary border border-border">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{job?.role || job?.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{job?.name}</span>
                  {job?.industry && (
                    <>
                      <span>•</span>
                      <span>{job.industry}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {job?.location && (
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm">
                  <MapPin className="h-4 w-4 text-primary" /> {job.location}
                </div>
              )}
              {job?.experience && (
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm">
                  <Clock className="h-4 w-4 text-primary" /> {job.experience}
                </div>
              )}
              {job?.openings != null && (
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm">
                  <Users className="h-4 w-4 text-primary" /> {job.openings} Opening
                  {job.openings === 1 ? "" : "s"}
                </div>
              )}
              {job?.salary && (
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm">
                  <Briefcase className="h-4 w-4 text-primary" /> {job.salary}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="border-t border-border pt-6 pb-2">
                <h3 className="text-lg font-bold mb-4">Role Overview</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 sm:grid-cols-3">
                  {job?.salary && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground">CTC</p>
                      <p className="mt-1 font-medium">{job.salary}</p>
                    </div>
                  )}
                  {job?.working_hours && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Working Hours
                      </p>
                      <p className="mt-1 font-medium">{job.working_hours}</p>
                    </div>
                  )}
                  {job?.shift_timing && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Shift Timing
                      </p>
                      <p className="mt-1 font-medium">{job.shift_timing}</p>
                    </div>
                  )}
                  {job?.working_days && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Working Days
                      </p>
                      <p className="mt-1 font-medium">{job.working_days}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="text-lg font-bold">Job Description</h3>
                {job?.description ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    No detailed description provided for this role.
                  </p>
                )}
              </div>

              {job?.skills && (
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

          {/* Applicant Card (right/sidebar) */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Applicant Details</h3>

              {!item ? (
                <div className="text-sm text-muted-foreground">No applicant data available.</div>
              ) : (
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Full Name</div>
                    <div className="font-semibold">{item.fullName}</div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="font-semibold">{item.email || "—"}</div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Phone</div>
                    <div className="font-semibold">{item.phone || "—"}</div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Applicant Status</div>
                    <div className="flex flex-col gap-2">
                      <div className=" flex items-center gap-2">
                        <select
                          value={status}
                          disabled={updatingStatus}
                          onChange={(e) => handleStatusUpdate(e.target.value as ApplicantStatus)}
                          className="mt-1 w-30 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus:border-primary"
                        >
                          {APPLICANT_STATUSES.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => updateStatus(status)}
                          disabled={updatingStatus}
                          className="mt-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Applied On</div>
                    <div className="font-semibold">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Message</div>
                    <div className="font-semibold whitespace-pre-wrap">{item.message || "—"}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
