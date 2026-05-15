import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { api } from "@/lib/api";
import { Trash2, Plus, LogOut, Save, X, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Admin Dashboard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TestimonialsPage,
});

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  designation: string | null;
  category: string | null;
};

const empty: Omit<Testimonial, "id"> = {
  quote: "",
  name: "",
  designation: "",
  category: "",
};

function TestimonialsPage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<Testimonial, "id">>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await api.auth.me();
        setIsAdmin(true);
        setAuthChecked(true);
        await loadItems();
      } catch (err: any) {
        navigate({ to: "/admin/login" });
      }
    };
    init();
  }, [navigate]);

  const loadItems = async () => {
    try {
      const data = await api.testimonials.list();
      setItems(data ?? []);
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
    if (!draft.quote.trim() || !draft.name.trim()) return;
    setSaving(true);
    const payload = { ...draft };
    try {
      await api.testimonials.create(payload);
      await loadItems();
      cancel();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await api.testimonials.delete(id);
      await loadItems();
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
            <h1 className="text-3xl font-bold">Testimonials</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage user testimonials.</p>
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
              <Plus className="h-4 w-4" /> Add Testimonial
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
            <h2 className="text-lg font-bold">Add new testimonial</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Quote *" className="md:col-span-2">
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.quote}
                  onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
                />
              </Field>
              <Field label="Name *">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </Field>
              <Field label="Designation">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.designation ?? ""}
                  onChange={(e) => setDraft({ ...draft, designation: e.target.value })}
                />
              </Field>
              <Field label="Category">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  value={draft.category ?? ""}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
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
                <th className="p-4">Quote</th>
                <th className="p-4">Name</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No testimonials yet. Click "Add Testimonial" to create one.
                  </td>
                </tr>
              )}
              {items.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="p-4 font-semibold">{t.quote}</td>
                  <td className="p-4">{t.name}</td>
                  <td className="p-4">{t.designation || "—"}</td>
                  <td className="p-4">{t.category || "—"}</td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => remove(t.id)}
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
