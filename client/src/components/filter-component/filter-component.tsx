import { useState, type JSX, type FormEvent } from "react";

export type FilterValues = {
  search: string;
  status: 'valid' | 'invalid' | 'incorrect' | '';
  sort: 'date_asc' | 'date_desc';
};

interface FilterComponentProps {
  onApply: (filters: FilterValues) => void;
  initialFilters?: Partial<FilterValues>;
}

function FilterComponent({ onApply, initialFilters = {} }: FilterComponentProps): JSX.Element {
  const [search, setSearch] = useState(initialFilters.search || '');
  const [status, setStatus] = useState<FilterValues['status']>(initialFilters.status || '');
  const [sort, setSort] = useState<FilterValues['sort']>(initialFilters.sort || 'date_desc');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onApply({ search, status, sort });
  };

  const statuses = [
    { id: 'valid' as const, text: 'Подпись действительна' },
    { id: 'invalid' as const, text: 'Подпись недействительна' },
    { id: 'incorrect' as const, text: 'Некорректный файл' }
  ];

  return (
    <form onSubmit={handleSubmit} className="filters-container">
      <div className="filters-content">
        <div className="filters-header">
          <p className="filters-title">Фильтры</p>
        </div>

        <div className="filter-group-line">
          <label className="filter-label">Название</label>
          <input 
            type="text" 
            className="filter-input" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Статус</label>
          <div className="status-options">
            {statuses.map((s) => (
              // 👇 Заменяем <label> на <div>. Убираем нативный radio, который блокирует снятие галочки
              <div
                key={s.id}
                className={`status-option ${status === s.id ? 'active' : ''}`}
                onClick={() => setStatus(prev => prev === s.id ? '' : s.id)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                role="radio"
                aria-checked={status === s.id}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setStatus(prev => prev === s.id ? '' : s.id); }}
              >
                <svg 
                  className={`status-checkbox ${status === s.id ? 'checked' : ''}`} 
                  width="21" 
                  height="21" 
                  viewBox="0 0 21 21" 
                  fill="none"
                >
                  <circle cx="10.5" cy="10.5" r="10" fill="#D9D9D9" stroke="#9D9D9D" />
                  {status === s.id && (
                    <path 
                      d="M16 6L8.54217 15L6 11.9321" 
                      stroke="#7570AE" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
                
                <span className="status-text">{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="filter-group filter-group-last">
          <label className="filter-label">Сортировать</label>
          <div className="sort-select">
            <select 
              className="select-box" 
              value={sort}
              onChange={(e) => setSort(e.target.value as FilterValues['sort'])}
            >
              <option value="date_desc">Сначала позже</option>
              <option value="date_asc">Сначала раньше</option>
            </select>
          </div>
        </div>

        <button type="submit" className="search-button">Найти</button>
      </div>
    </form>
  );
}

export { FilterComponent };