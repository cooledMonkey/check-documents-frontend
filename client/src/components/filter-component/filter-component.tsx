import { useState, type JSX } from "react";

function FilterComponent(): JSX.Element {
    const [selectedStatus, setSelectedStatus] = useState('valid');

  const statuses = [
    { id: 'valid', text: 'Подпись действительна' },
    { id: 'invalid', text: 'Подпись недействительна' },
    { id: 'incorrect', text: 'Некорректный файл' }
  ];
    return(<div><div className="filters-container">
  <div className="filters-content">
    <div className="filters-header">
      <p className="filters-title">Фильтры</p>
    </div>

    {/* <!-- Название фильтра --> */}
    <div className="filter-group-line">
      <label className="filter-label">Название</label>
      <input type="text" className="filter-input" />
    </div>
    
    {/* <!-- Статус фильтра --> */}
    <div className="filter-group">
      <label className="filter-label">Статус</label>
<div className="status-options">
      {statuses.map((status) => (
        <label 
          key={status.id}
          className={`status-option ${selectedStatus === status.id ? 'active' : ''}`}
          onClick={() => setSelectedStatus(status.id)}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {/* Скрытый radio input */}
          <input
            type="radio"
            name="signatureStatus"
            value={status.id}
            checked={selectedStatus === status.id}
            onChange={() => setSelectedStatus(status.id)}
            style={{ display: 'none' }}
          />
          
          {/* Кастомный чекбокс */}
          <svg 
            className={`status-checkbox ${selectedStatus === status.id ? 'checked' : ''}`} 
            width="21" 
            height="21" 
            viewBox="0 0 21 21" 
            fill="none"
          >
            <circle cx="10.5" cy="10.5" r="10" fill="#D9D9D9" stroke="#9D9D9D" />
            {selectedStatus === status.id && (
              <path 
                d="M16 6L8.54217 15L6 11.9321" 
                stroke="#7570AE" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            )}
          </svg>
          
          <span className="status-text">{status.text}</span>
        </label>
      ))}
    </div>
    </div>
    <div className="filter-group filter-group-last">
      <label className="filter-label">Сортировать</label>
      <div className="sort-select">
        <select className="select-box" name="Сортировать" id="pet-select">
          <option value="dog">Сначала раньше</option>
          <option value="cat">Сначала позже</option>
        </select>
      </div>
    </div>

    <button className="search-button">Найти</button>
  </div>
</div></div>);
}
export{FilterComponent}