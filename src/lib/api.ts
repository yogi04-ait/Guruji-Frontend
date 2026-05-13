import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const _cache = new Map<string, { ts: number; data: any }>();
const _inflight = new Map<string, Promise<any>>();
const CACHE_TTL = 1000 * 60 * 2; // 2 minutes

function cachedFetch(key: string, fn: () => Promise<any>) {
  const now = Date.now();

  const cached = _cache.get(key);
  if (cached && now - cached.ts < CACHE_TTL) {
    return Promise.resolve(cached.data);
  }

  const inflight = _inflight.get(key);
  if (inflight) return inflight;

  const p = fn()
    .then((res) => {
      _cache.set(key, {
        ts: Date.now(),
        data: res,
      });

      _inflight.delete(key);

      return res;
    })
    .catch((err) => {
      _inflight.delete(key);
      throw err;
    });

  _inflight.set(key, p);

  return p;
}

export const api = {
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      const response = await apiClient.post("/login", credentials);
      return response.data;
    },

    signup: async (credentials: { email: string; password: string }) => {
      const response = await apiClient.post("/signup", credentials);
      return response.data;
    },

    logout: async () => {
      const response = await apiClient.get("/logout");
      return response.data;
    },

    me: async () => {
      const response = await apiClient.get("/me");
      return response.data;
    },
  },

  companies: {
    list: async () => {
      return cachedFetch("companies:list", async () => {
        const response = await apiClient.get("/list");

        const items = response.data?.data || [];

        return Array.isArray(items)
          ? items.map((item: any) => ({
              ...item,
              id: item._id || item.id,
            }))
          : [];
      });
    },

    create: async (data: any) => {
      const response = await apiClient.post("/create", data);

      // Clear cache after create
      _cache.delete("companies:list");

      return response.data;
    },

    update: async (id: string, data: any) => {
      const response = await apiClient.put(`/update/${id}`, data);

      _cache.delete("companies:list");

      return response.data;
    },

    delete: async (id: string) => {
      const response = await apiClient.delete(`/delete/${id}`);

      _cache.delete("companies:list");

      return response.data;
    },

    apply: async (jobId: string, applicationData: any) => {
      const response = await apiClient.post(`/apply/${jobId}`, applicationData);

      return response.data;
    },

    jobdetails: async (jobId: string) => {
      const response = await apiClient.get(`/jobs/${jobId}`);

      return response.data;
    },
  },
  testimonials: {
    list: async () => {
      return cachedFetch("testimonials:list", async () => {
        const response = await apiClient.get("/testimonials");

        const items = response.data || [];

        return Array.isArray(items)
          ? items.map((item: any) => ({
              ...item,
              id: item._id || item.id,
            }))
          : [];
      });
    },
  },

  hiringPartners: {
    list: async () => {
      return cachedFetch("partners:list", async () => {
        const response = await apiClient.get("/partner/list");

        const items = response.data?.data || [];

        return Array.isArray(items)
          ? items.map((item: any) => ({
              ...item,
              id: item._id || item.id,
            }))
          : [];
      });
    },

    create: async (data: any) => {
      const response = await apiClient.post("/partner/create", data);

      _cache.delete("partners:list");

      return response.data;
    },

    delete: async (id: string) => {
      const response = await apiClient.delete(`/partner/delete/${id}`);

      _cache.delete("partners:list");

      return response.data;
    },
  },
};
