import React, { useState } from 'react';
import '../styles/AdvancedSearch.css';

function AdvancedSearch({ onSearch, members, labels }) {
  const [filters, setFilters] = useState({
    searchText: '',
    assignee: '',
    labels: [],
    priority: '',
    dueDate: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <div className="advanced-search">
      <form onSubmit={handleSearch}>
        <div className="search-row">
          <div className="search-input">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="ابحث في المهام..."
              value={filters.searchText}
              onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
            />
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>المسؤول</label>
            <select
              value={filters.assignee}
              onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
            >
              <option value="">الكل</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>التصنيفات</label>
            <div className="labels-filter">
              {labels.map(label => (
                <label key={label.id} className="label-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.labels.includes(label.id)}
                    onChange={(e) => {
                      const newLabels = e.target.checked
                        ? [...filters.labels, label.id]
                        : filters.labels.filter(id => id !== label.id);
                      setFilters({ ...filters, labels: newLabels });
                    }}
                  />
                  <span className="label-name">{label.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>الأولوية</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="">الكل</option>
              <option value="high">عالية</option>
              <option value="medium">متوسطة</option>
              <option value="low">منخفضة</option>
            </select>
          </div>

          <div className="filter-group">
            <label>تاريخ الاستحقاق</label>
            <input
              type="date"
              value={filters.dueDate}
              onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
            />
          </div>
        </div>

        <div className="search-actions">
          <button type="submit" className="btn-primary">
            بحث
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setFilters({
              searchText: '',
              assignee: '',
              labels: [],
              priority: '',
              dueDate: ''
            })}
          >
            إعادة تعيين
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdvancedSearch; 