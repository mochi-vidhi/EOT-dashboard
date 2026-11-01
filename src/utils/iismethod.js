// Common utility functions — reusable across the entire EOT project

// Array helpers
export const replaceAt = (arr, i, val) => { const c = [...arr]; c[i] = val; return c; };
export const takeFirst = (arr, n) => arr.slice(0, n);
export const takeLast = (arr, n) => arr.slice(-n);
export const filledArray = (len, fill = "") => Array(len).fill(fill);

// String helpers
export const digitsOnly = (str) => (str || "").replace(/\D/g, "");
export const lastChar = (str) => { const d = digitsOnly(str); return d.length ? d.slice(-1) : ""; };
export const truncate = (str, max = 30) => (!str || str.length <= max) ? str : str.slice(0, max) + "…";

// Clipboard
export async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch { return false; }
}

export async function readFromClipboard() {
  try { return await navigator.clipboard.readText(); }
  catch { return ""; }
}

// OTP handlers — used by OtpInput component and any future OTP flows
export function handleOtpPaste(e, length, onChange, refs) {
  e.preventDefault();
  const digits = digitsOnly(e.clipboardData.getData("text")).slice(0, length);
  const result = filledArray(length);
  digits.split("").forEach((ch, i) => { result[i] = ch; });
  onChange(result);
  refs.current?.[Math.min(digits.length, length - 1)]?.focus();
}

export function handleOtpKeyDown(e, idx, value, refs) {
  if (e.key === "Backspace" && !value[idx] && idx > 0) {
    refs.current?.[idx - 1]?.focus();
  }
}

export function handleOtpChange(e, idx, value, length, onChange, refs) {
  const ch = lastChar(e.target.value);
  onChange(replaceAt(value, idx, ch));
  if (ch && idx < length - 1) refs.current?.[idx + 1]?.focus();
}

// Keyboard helpers
export const preventKey = (e, key) => { if (e.key === key) e.preventDefault(); };
export const submitOnEnter = (e, cb) => { if (e.key === "Enter") { e.preventDefault(); cb(); } };

// Formatting
export function formatPhone(raw) {
  const d = digitsOnly(raw);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `${d.slice(0, 2)} ${d.slice(2)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 7)} ${d.slice(7, 12)}`;
}

// Validation
export const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const isValidPhone = (s) => digitsOnly(s).length >= 10;
export const isNotEmpty = (s) => (s || "").trim().length > 0;
