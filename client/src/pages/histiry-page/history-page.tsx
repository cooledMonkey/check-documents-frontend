import type { JSX } from "react";
import { useState, useCallback } from "react";
import { FilterComponent, type FilterValues } from "../../components/filter-component/filter-component";
import { HeaderComponent } from "../../components/header/header-component";
import { HistoryResultsList } from "../../components/history-result-list/history-result-list";

function HistoryPage(): JSX.Element {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    status: '',
    sort: 'date_desc'
  });
  const [page, setPage] = useState(0);

  const handleFilterApply = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
    setPage(0);
  }, []);

  return (
    <div>
      <HeaderComponent />
      <section className="content-container">
        <div className="file-list-container">
          <HistoryResultsList filters={filters} page={page} onPageChange={setPage} />
        </div>
        <FilterComponent onApply={handleFilterApply} initialFilters={filters} />
      </section>
    </div>
  );
}

export { HistoryPage };