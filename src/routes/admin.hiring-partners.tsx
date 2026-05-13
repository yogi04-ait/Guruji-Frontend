import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { api } from "@/lib/api";
import { Trash2, Plus, LogOut, Save, X, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/hiring-partners")({
  head: () => ({
    meta: [
      { title: "Hiring Partners — Admin Dashboard" },
      // Prevent search engines from indexing admin pages
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: HiringPartnersPage,
});

type HiringPartner = {
  id: string;
  name: string;
};

const empty: Omit<HiringPartner, "id"> = {
  name: "",
};

function HiringPartnersPage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [partners, setPartners] = useState<HiringPartner[]>([]);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<HiringPartner, "id">>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await api.auth.me();
        setIsAdmin(true);
        setAuthChecked(true);
        await loadPartners();
      } catch (err: any) {
        navigate({ to: "/admin/login" });
      }
    };
    init();
  }, [navigate]);

  const loadPartners = async () => {
    try {
      const data = await api.hiringPartners.list();
      setPartners(data ?? []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate({ to: "/admin/login" });
      }
    }
  };

  const startCreate = () => {
    setDraft(empty);
    setCreating(true);
  };

  const cancel = () => {
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

  const save = async () => {
    if (!draft.name.trim()) return;
    setSaving(true);
    const payload = {
      ...draft,
    };
    try {
      await api.hiringPartners.create(payload);
      await loadPartners();
      cancel();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this hiring partner?")) return;
    try {
      await api.hiringPartners.delete(id);
      await loadPartners();
    } catch (err) {
      handleAuthError(err);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {}
    navigate({ to: "/admin/login" });
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
            <h1 className="text-3xl font-bold">Hiring Partners</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your hiring partners.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate({ to: "/admin" })}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </button>
            <button
              onClick={startCreate}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:bg-primary-glow"
            >
              <Plus className="h-4 w-4" /> Add Partner
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        {creating && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold">Add new partner</h2>
            <div className="mt-4 grid gap-4">
              <Field label="Company name *">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </Field>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60"
              >
                <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
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

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4">Company Name</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.length === 0 && (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-muted-foreground">
                    No hiring partners yet. Click "Add Partner" to create one.
                  </td>
                </tr>
              )}
              {partners.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-4 font-semibold">{p.name}</td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => remove(p.id)}
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
      </section>
    </Layout>
  );
}

function Field({
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
}
