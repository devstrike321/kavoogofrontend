// src/components/Pagination.tsx
import React from "react";

interface Props {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const createPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  const pages = createPageNumbers();

  return (
    <div className="pagination-container">
      <button disabled={currentPage === 1} onClick={() => onPageChange(1)}>
        « First
      </button>

      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        ‹ Prev
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="dots">...</span>
        ) : (
          <button
            key={idx}
            className={p === currentPage ? "active" : ""}
            onClick={() => onPageChange(p as number)}
          >
            {p}
          </button>
        )
      )}

      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Next ›
      </button>

      <button disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)}>
        Last »
      </button>
    </div>
  );
}
