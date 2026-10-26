export default function FilterForm({ filter, onFilterChange, disabled }) {
  return (
    <form className="filter-form" role="search" onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="title-filter">Filter by title</label>
      <div className="filter-controls">
        <input
          id="title-filter"
          type="search"
          name="title"
          placeholder="Search post titles…"
          value={filter}
          onChange={(event) => onFilterChange(event.target.value)}
          disabled={disabled}
          aria-describedby="filter-help"
        />
        <button type="button" onClick={() => onFilterChange('')} disabled={disabled || !filter}>
          Clear
        </button>
      </div>
      <p id="filter-help" className="hint">Titles filter as you type. Search ignores letter case.</p>
    </form>
  );
}
