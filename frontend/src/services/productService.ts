// Product service: reads token from localStorage ("token") and attaches Authorization header.
// This file intentionally does NOT import React hooks so it can be used from anywhere.

import { Product } from "@/types/product";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "";
const BASE = `${API_BASE_URL}/api/products`;

function getTokenFromStorage(): string | null {
  try {
    return localStorage.getItem("token");
  } catch (e) {
    // If accessing localStorage fails (e.g. SSR), return null.
    // Caller should handle missing token (backend will respond 401/403).
    console.warn("Unable to read token from localStorage", e);
    return null;
  }
}

function getJsonHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getTokenFromStorage();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    const message =
      body && typeof body === "object"
        ? body.error || body.message || JSON.stringify(body)
        : body || response.statusText || "Request failed";
    throw new Error(message);
  }

  return body;
}

// GET ALL Products
export const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${BASE}`, {
    method: "GET",
    headers: getJsonHeaders(),
  });
  return (await handleResponse(res)) as Product[];
};

// GET A SINGLE Product
export const fetchProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "GET",
    headers: getJsonHeaders(),
  });
  return (await handleResponse(res)) as Product;
};

// CREATE A Product
export const createProduct = async (
  productData: Omit<Product, "_id" | "createdAt" | "updatedAt">
): Promise<Product> => {
  const res = await fetch(`${BASE}`, {
    method: "POST",
    headers: getJsonHeaders(),
    body: JSON.stringify(productData),
  });
  return (await handleResponse(res)) as Product;
};

// UPDATE A Product
export const updateProduct = async (
  id: string,
  productData: Partial<Product>
): Promise<Product> => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH", // <-- FIX: Changed from PUT to PATCH
    headers: getJsonHeaders(),
    body: JSON.stringify(productData),
  });
  return (await handleResponse(res)) as Product;
};

// DELETE A Product
export const deleteProduct = async (id: string): Promise<Product> => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: getJsonHeaders(),
  });
  return (await handleResponse(res)) as Product;
};
