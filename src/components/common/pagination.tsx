import React from "react";
import { Button } from "../ui/button";

export function Pagination({
  nextPage,
  setPage,
  page,
}: {
  nextPage: number | null;
  setPage: (page: number) => void;
  page: number;
}) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={nextPage === null}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
