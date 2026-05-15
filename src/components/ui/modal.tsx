import React from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
  small = false,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  small?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className={`relative mx-4 w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-lg ${
          small ? "max-w-xl" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>{title && <h3 className="text-lg font-bold">{title}</h3>}</div>
          <button
            onClick={onClose}
            className="rounded-full border border-border bg-background p-2 hover:bg-secondary"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
