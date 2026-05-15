import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { api } from "@/lib/api";
import { Trash2, Plus, LogOut, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/applicants")({
  head: () => ({
    meta: [
      { title: "Applicants — Admin Dashboard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ApplicantsPage,
});

type Applicant = {
  _id: string;
  fullName: string;
  phone?: string;
  email?: string;
  companyName?: string;
  jobRole?: string;
  applicantStatus?: string;
};

const STATUS_OPTIONS = ["all", "new", "reviewed", "shortlisted", "rejected"];

function ApplicantsPage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [items, setItems] = useState<Applicant[]>([]);
  const [meta, setMeta] = useState<any>({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState<string>("all");

  // Export UI
  const [showExport, setShowExport] = useState(false);
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await api.auth.me();
        setIsAdmin(true);
        setAuthChecked(true);
        await load(page, status);
      } catch (err: any) {
        navigate({ to: "/admin/login" });
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load(page, status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const load = async (p: number, s: string) => {
    setLoading(true);
    try {
      const res = await api.applicants.list(p, limit, s);
      setItems(res.items || []);
      setMeta(res.meta || { page: p, totalPages: 1 });
    } catch (err: any) {
      if (err.response?.status === 401) navigate({ to: "/admin/login" });
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = (s: string) => {
    setPage(1);
    setStatus(s);
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {}
    navigate({ to: "/admin/login" });
  };

  const goToDetails = (_id: string) => {
    navigate({ to: `/admin/applicant/${_id}` });
  };

  const downloadPreset = async (range: string) => {
    setExporting(true);
    try {
      const blob = await api.applicants.excel({ range, applicantStatus: status });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applicants_${range}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Excel downloaded successfully");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        toast.error(
          err.response?.data?.message || "No applicants found for the selected date range",
        );
      } else {
        toast.error("Failed to export applicants");
      }
    } finally {
      setExporting(false);
      setShowExport(false);
    }
  };

  const downloadCustom = async () => {
    if (!customStart || !customEnd) return toast.error("Select start and end dates");
    if (customStart > customEnd) return toast.error("Start date must be before end date");

    setExporting(true);
    try {
      const blob = await api.applicants.excel({
        startDate: customStart,
        endDate: customEnd,
        applicantStatus: status,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applicants_${customStart}_${customEnd}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Excel downloaded successfully");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        toast.error(
          err.response?.data?.message || "No applicants found for the selected date range",
        );
      } else {
        toast.error("Failed to export applicants");
      }
    } finally {
      setExporting(false);
      setShowExport(false);
    }
  };

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
          <button
            onClick={logout}
            className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Sign out
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Applicants</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage job applicants.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate({ to: "/admin" })}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </button>

            <div className="relative">
              <button
                onClick={() => setShowExport((s) => !s)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
              >
                <Plus className="h-4 w-4" /> Download Excel
              </button>
              {showExport && (
                <div className="absolute right-0 mt-2 w-72 rounded-lg border border-border bg-card p-4 shadow-lg z-10">
                  <div className="space-y-2">
                    <button
                      onClick={() => downloadPreset("3months")}
                      className="w-full rounded-full border border-border px-3 py-2 text-sm text-left hover:bg-secondary"
                    >
                      Last 3 Months
                    </button>
                    <button
                      onClick={() => downloadPreset("6months")}
                      className="w-full rounded-full border border-border px-3 py-2 text-sm text-left hover:bg-secondary"
                    >
                      Last 6 Months
                    </button>
                    <button
                      onClick={() => downloadPreset("1year")}
                      className="w-full rounded-full border border-border px-3 py-2 text-sm text-left hover:bg-secondary"
                    >
                      Last 1 Year
                    </button>
                    <div className="pt-2">
                      <div className="text-xs text-muted-foreground">Custom range</div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={customStart}
                          onChange={(e) => setCustomStart(e.target.value)}
                          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                        />
                        <input
                          type="date"
                          value={customEnd}
                          onChange={(e) => setCustomEnd(e.target.value)}
                          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                        />
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={downloadCustom}
                          disabled={exporting}
                          className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => setShowExport(false)}
                          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => handleStatus(opt)}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition-all 
                ${status === opt ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-secondary"}`}
            >
              {opt === "all" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email</th>
                <th className="p-4">Company</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No applicants found.
                  </td>
                </tr>
              )}

              {!loading &&
                items.map((a) => (
                  <tr key={a._id} className="border-t border-border">
                    <td className="p-4 font-semibold">{a.fullName}</td>
                    <td className="p-4">{a.phone || "—"}</td>
                    <td className="p-4">{a.email || "—"}</td>
                    <td className="p-4">{a.companyName || "—"}</td>
                    <td className="p-4">{a.jobRole || "—"}</td>
                    <td className="p-4">{a.applicantStatus || "—"}</td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => goToDetails(a._id)}
                          className="rounded-lg border border-border p-2 hover:bg-secondary"
                        >
                          View More
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages} — {meta.total} applicants
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-full border border-border bg-card px-3 py-1 text-sm font-semibold hover:bg-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages || 1, p + 1))}
              disabled={page >= (meta.totalPages || 1)}
              className="rounded-full border border-border bg-card px-3 py-1 text-sm font-semibold hover:bg-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
