import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { Layout } from "@/components/Layout";
import { api } from "@/lib/api";
import {
  Pencil,
  Trash2,
  Plus,
  LogOut,
  Save,
  X,
  Eye,
  EyeOff,
  Users,
  MessageSquare,
  FileText,
  FileClock,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Guruji Job Consultancy" },
      // Prevent search engines from indexing admin pages
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Company = {
  id: string;
  name: string;
  industry: string | null;
  location: string | null;
  role: string | null;
  experience: string | null;
  openings: number | null;
  salary: string | null;
  working_days: string | null;
  working_hours: string | null;
  description: string | null;
  status: "active" | "closed" | "archived";
};

const empty: Omit<Company, "id"> = {
  name: "",
  industry: "",
  location: "",
  role: "",
  experience: "",
  openings: 1,
  salary: "",
  working_days: "",
  working_hours: "",
  description: "",
  status: "active",
};

function AdminPage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState<any>({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<Company, "id">>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await api.auth.me();
        setIsAdmin(true);
        setAuthChecked(true);
        await loadCompanies(page);
      } catch (err: any) {
        navigate({ to: "/admin/login" });
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);
  const loadCompanies = useCallback(
    async (p = 1) => {
      setLoadingCompanies(true);
      try {
        const res = await api.companies.list(p, limit);

        // Support legacy non-paginated responses
        if (Array.isArray(res)) {
          setCompanies(res ?? []);
          setMeta({ page: 1, totalPages: 1, total: res.length, limit });
        } else {
          setCompanies(res.items || []);
          setMeta(res.meta || { page: p, totalPages: 1, total: res.items?.length || 0, limit });
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          navigate({ to: "/admin/login" });
        }
      } finally {
        setLoadingCompanies(false);
      }
    },
    [navigate, limit],
  );

  const startCreate = useCallback(() => {
    setDraft(empty);
    setCreating(true);
    setEditing(null);
  }, []);

  const startEdit = useCallback(async (c: Company) => {
    setEditing(c);
    const values = await api.companies.jobdetails(c.id);
    setDraft({ ...values.data });
    setCreating(false);
  }, []);

  const cancel = () => {
    setEditing(null);
    setCreating(false);
    setDraft(empty);
  };

  const handleAuthError = (err: any) => {
    if (err.response?.status === 401) {
      navigate({ to: "/admin/login" });
    } else {
      console.error(err);
      alert(err.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    // load when page changes
    loadCompanies(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const save = async () => {
    if (!draft.name.trim()) return;
    setSaving(true);

    // Remove id and _id from draft before sending to backend to prevent immutable field errors
    const { id, _id, ...draftData } = draft as any;

    const payload = {
      ...draftData,
      openings: Number(draft.openings) || 0,
    };

    try {
      if (editing) {
        await api.companies.update(editing.id, payload);
      } else {
        await api.companies.create(payload);
      }
      await loadCompanies(page);
      cancel();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = useCallback(
    async (id: string) => {
      if (!confirm("Delete this company listing?")) return;

      // Instant UI update
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      try {
        await api.companies.delete(id);
        // After deletion, if this was the last item on the page, go back a page
        if (companies.length === 1 && page > 1) {
          setPage((p) => p - 1);
        } else {
          await loadCompanies(page);
        }
        } catch (err) {
          // On error reload from backend
          await loadCompanies(page);
          handleAuthError(err);
      }
    },
    [loadCompanies, companies, page],
  );

  const toggleActive = useCallback(
    async (c: Company) => {
      try {
        // Don't allow toggling archived jobs
        if (c.status === "archived") {
          return;
        }

        const newStatus = c.status === "active" ? "closed" : "active";

        await api.companies.update(c.id, {
          status: newStatus,
        });

        await loadCompanies(page);
      } catch (err) {
        handleAuthError(err);
      }
    },
    [loadCompanies, page],
  );

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch (e) {}
    navigate({ to: "/admin/login" });
  }, [navigate]);

  const adminActions = useMemo(
    () => ({ onAddJob: startCreate, onLogout: logout }),
    [startCreate, logout],
  );

  if (!authChecked) {
    return (
      <Layout adminMode adminActions={adminActions}>
        <div className="p-20 text-center text-muted-foreground">Loading…</div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout adminMode adminActions={adminActions}>
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
    <Layout adminMode adminActions={adminActions}>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage currently hiring company listings.
            </p>
          </div>
          <div className="hidden gap-3 lg:flex">
            <button
              onClick={() => navigate({ to: "/admin/hiring-partners" })}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              <Users className="h-4 w-4" /> Hiring Partners
            </button>
            <button
              onClick={() => navigate({ to: "/admin/testimonials" })}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              <MessageSquare className="h-4 w-4" /> Testimonials
            </button>
            <button
              onClick={() => navigate({ to: "/admin/applicants" })}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              <FileText className="h-4 w-4" /> Applicants
            </button>
            <button
              onClick={() => navigate({ to: "/admin/enquiries" as any })}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              <FileClock className="h-4 w-4" /> Enquiries
            </button>
            <button
              onClick={startCreate}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:bg-primary-glow"
            >
              <Plus className="h-4 w-4" /> Add Job
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        {(creating || editing) && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold">{editing ? "Edit Job" : "Add new Job"}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Company name *">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </Field>
              <Field label="Industry">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.industry ?? ""}
                  onChange={(e) => setDraft({ ...draft, industry: e.target.value })}
                />
              </Field>
              <Field label="Location">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.location ?? ""}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                />
              </Field>
              <Field label="Role / Position">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.role ?? ""}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                />
              </Field>
              <Field label="Experience required">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.experience ?? ""}
                  onChange={(e) => setDraft({ ...draft, experience: e.target.value })}
                />
              </Field>
              <Field label="Openings">
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.openings ?? 0}
                  onChange={(e) => setDraft({ ...draft, openings: Number(e.target.value) })}
                />
              </Field>
              <Field label="CTC">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.salary ?? ""}
                  onChange={(e) => setDraft({ ...draft, salary: e.target.value })}
                  placeholder="e.g. 5-8 LPA"
                />
              </Field>
              <Field label="Working Days">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.working_days ?? ""}
                  onChange={(e) => setDraft({ ...draft, working_days: e.target.value })}
                  placeholder="e.g. 5 Days"
                />
              </Field>
              <Field label="Working Hours">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.working_hours ?? ""}
                  onChange={(e) => setDraft({ ...draft, working_hours: e.target.value })}
                  placeholder="e.g. 9 AM - 6 PM"
                />
              </Field>
              <Field label="Description" className="md:col-span-2">
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.description ?? ""}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </Field>
              <label className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  checked={draft.status === "active"}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      status: e.target.checked ? "active" : "closed",
                    })
                  }
                />

                <span className="text-sm">Active (visible on public hiring page)</span>
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60"
              >
                <Save className="h-4 w-4" />{" "}
                {saving ? (editing ? "Updating…" : "Saving…") : editing ? "Update Job" : "Save"}
              </button>
              <button
                onClick={cancel}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          </div>
        )}

        <CompaniesTable
          companies={companies}
          onEdit={startEdit}
          onRemove={remove}
          onToggleActive={toggleActive}
        />
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages} — {meta.total} listings
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

const Field = memo(function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
});

const CompaniesTable = memo(function CompaniesTable({
  companies,
  onEdit,
  onRemove,
  onToggleActive,
}: {
  companies: Company[];
  onEdit: (c: Company) => void | Promise<void>;
  onRemove: (id: string) => void | Promise<void>;
  onToggleActive: (c: Company) => void | Promise<void>;
}) {
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="p-4">Company</th>
            <th className="p-4">Role</th>
            <th className="p-4">Location</th>
            <th className="p-4">Openings</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-muted-foreground">
                No listings yet. Click "Add Jobs" to create one.
              </td>
            </tr>
          )}
          {companies.map((c) => (
            <tr key={c.id} className="border-t border-border">
              <td className="p-4 font-semibold">
                {c.name}
                <div className="text-xs font-normal text-muted-foreground">{c.industry}</div>
              </td>
              <td className="p-4">{c.role || "—"}</td>
              <td className="p-4">{c.location || "—"}</td>
              <td className="p-4">{c.openings ?? "—"}</td>
              <td className="p-4">
                <button
                  onClick={() => onToggleActive(c)}
                  disabled={c.status === "archived"}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-opacity
      ${
        c.status === "active"
          ? "bg-green-500/15 text-green-600"
          : c.status === "closed"
            ? "bg-yellow-500/15 text-yellow-600"
            : "bg-muted text-muted-foreground opacity-60 cursor-not-allowed"
      }
    `}
                >
                  {c.status === "active" ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}

                  {c.status === "active" ? "Active" : c.status === "closed" ? "Closed" : "Archived"}
                </button>
              </td>
              <td className="p-4 text-right">
                <div className="inline-flex gap-2">
                  <button
                    onClick={() => onEdit(c)}
                    className="rounded-lg border border-border p-2 hover:bg-secondary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onRemove(c.id)}
                    className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
