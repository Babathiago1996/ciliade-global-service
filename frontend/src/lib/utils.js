import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date) {
  if (!date) return "";

  try {
    return new Date(date).toISOString().split("T")[0];
  } catch {
    return "";
  }
}
