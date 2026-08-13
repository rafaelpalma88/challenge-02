import type { StatusFilter } from '../types';

interface SearchFilterBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    status: StatusFilter;
    onStatusChange: (status: StatusFilter) => void;
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'incomplete', label: 'Open' },
    { value: 'completed', label: 'Done' },
];

export function SearchFilterBar({
    query,
    onQueryChange,
    status,
    onStatusChange,
}: SearchFilterBarProps) {
    return (
        <div className="filter-bar">
            <div className="filter-bar__search">
                <label htmlFor="todo-search" className="visually-hidden">
                    Search entries
                </label>
                <input
                    id="todo-search"
                    type="search"
                    className="filter-bar__search-input"
                    placeholder="Search title or description…"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                />
            </div>

            <div className="filter-bar__status" role="group" aria-label="Filter by status">
                {STATUS_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        className={`filter-bar__status-btn${status === option.value ? ' filter-bar__status-btn--active' : ''
                            }`}
                        aria-pressed={status === option.value}
                        onClick={() => onStatusChange(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}