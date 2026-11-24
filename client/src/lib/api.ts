import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 12_000,
  headers: { "Content-Type": "application/json" },
});

export function apiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;
    if (data?.errors) {
      const first = Object.values(data.errors).flat()[0];
      if (first) return first;
    }
    if (data?.message) return data.message;
    if (error.code === "ECONNABORTED") return "The request timed out. Please try again.";
    if (!error.response) {
      return "We could not reach the clinic server. Please check your connection or call us.";
    }
  }
  return "Something went wrong. Please try again.";
}

export type ApiList<T> = { data: T[]; total?: number };
export type ApiItem<T> = { data: T };
