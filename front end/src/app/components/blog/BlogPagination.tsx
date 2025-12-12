"use client";

import React from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const BlogPagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const goTo = (p: number) => () => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
  };

  // Build compact page list
  const pages: (number | string)[] = [];
  const push = (v: number | string) => pages.push(v);

  const addRange = (start: number, end: number) => {
    for (let i = start; i <= end; i++) push(i);
  };

  const windowSize = 1; // neighbors displayed on each side

  push(1);
  const left = Math.max(2, currentPage - windowSize);
  const right = Math.min(totalPages - 1, currentPage + windowSize);

  if (left > 2) push("...");
  addRange(left, right);
  if (right < totalPages - 1) push("...");
  if (totalPages > 1) push(totalPages);

  return (
    <nav className="flex items-center justify-center gap-2 select-none" aria-label="Pagination">
      <button
        onClick={goTo(currentPage - 1)}
        className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={currentPage === 1}
      >
        Précédent
      </button>

      <ul className="flex items-center gap-1">
        {pages.map((p, idx) => (
          <li key={`${p}-${idx}`}>
            {p === "..." ? (
              <span className="px-2 text-slate-500">…</span>
            ) : (
              <button
                onClick={goTo(p as number)}
                aria-current={p === currentPage ? "page" : undefined}
                className={`${p === currentPage ? "bg-emerald-600 text-white" : "bg-white text-slate-700 hover:bg-slate-50"} px-3 py-2 rounded-lg border border-slate-200`}
              >
                {p}
              </button>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={goTo(currentPage + 1)}
        className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={currentPage === totalPages}
      >
        Suivant
      </button>
    </nav>
  );
};
