import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { api } from "@/lib/api";
import { Trash2, ArrowLeft } from "lucide-react";
import { Modal } from "@/components/ui/modal";

export const Route = createFileRoute("/admin/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries — Admin Dashboard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EnquiriesPage,
});

type Enquiry = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  category?: string;
  status?: string;
  message?: string;
};

const STATUS_OPTIONS = ["all", "new", "seen"];

function EnquiriesPage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [items, setItems] = useState<Enquiry[]>([]);
  const [meta, setMeta] = useState<any>({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState<string>("all");

  const [viewOpen, setViewOpen] = useState(false);
  const [viewing, setViewing] = useState<Enquiry | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

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
      const res = await api.enquiries.list(p, limit, s);
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

  const openView = async (id: string) => {
    setViewLoading(true);
    setViewOpen(true);
    try {
      const data = await api.enquiries.get(id);
      setViewing(data as Enquiry);

      // If the enquiry was "new", update local state to seen
      setItems((prev) =>
        prev.map((it) => (it._id === id || it.id === id ? { ...it, status: "seen" } : it)),
      );
    } catch (err: any) {
      if (err.response?.status === 401) navigate({ to: "/admin/login" });
      else console.error(err);
    } finally {
      setViewLoading(false);
    }
  };

  const closeView = () => {
    setViewOpen(false);
    setViewing(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;

    const previous = items;

    // Optimistic UI update
    setItems((prev) => prev.filter((e) => !(e._id === id || e.id === id)));
    setMeta((m: any) => ({ ...m, total: Math.max(0, (m.total || 1) - 1) }));

    try {
      await api.enquiries.delete(id);

      // If current page now empty and not first page, go back one page
      if (items.length === 1 && page > 1) {
        setPage((p) => p - 1);
      }
    } catch (err: any) {
      setItems(previous);
      setMeta((m: any) => ({ ...m, total: (m.total || 0) + 1 }));
      if (err.response?.status === 401) navigate({ to: "/admin/login" });
      else {
        console.error(err);
        alert(err.response?.data?.message || "Delete failed");
      }
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
            <h1 className="text-3xl font-bold">Enquiries</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage user enquiries.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate({ to: "/admin" })}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </button>

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
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No enquiries found.
                  </td>
                </tr>
              )}

              {!loading &&
                items.map((a) => (
                  <tr key={a._id || a.id} className="border-t border-border">
                    <td className="p-4 font-semibold">{a.name}</td>
                    <td className="p-4">{a.phone || "—"}</td>
                    <td className="p-4">{a.email || "—"}</td>
                    <td className="p-4">{a.category || "—"}</td>
                    <td className="p-4">{a.status || "—"}</td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openView(a._id || (a.id as string))}
                          className="rounded-lg border border-border p-2 hover:bg-secondary"
                        >
                          View
                        </button>
                        <button
                          onClick={() => remove(a._id || (a.id as string))}
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

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages} — {meta.total} enquiries
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

        <Modal
          open={viewOpen}
          onClose={closeView}
          title={viewing ? viewing.name : "Enquiry details"}
        >
          {viewLoading && <div className="p-6 text-center text-muted-foreground">Loading…</div>}

          {!viewLoading && viewing && (
            <div className="grid gap-3">
              <div>
                <div className="text-xs text-muted-foreground">Name</div>
                <div className="font-semibold">{viewing.name}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="font-semibold">{viewing.email || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Phone</div>
                <div className="font-semibold">{viewing.phone || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Category</div>
                <div className="font-semibold">{viewing.category || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="font-semibold">{viewing.status || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Message</div>
                <div className="whitespace-pre-wrap">
                  {viewing.message || "No message available"}
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={closeView}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </section>
    </Layout>
  );
}
