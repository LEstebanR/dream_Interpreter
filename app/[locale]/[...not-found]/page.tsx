import { notFound } from "next/navigation";

// Without this, unmatched [locale] routes skip the locale layout (no CSS/header).
export default function NotFoundCatchAll() {
  notFound();
}
