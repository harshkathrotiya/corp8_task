import React from 'react';

const FilterBar = ({ filters, onFilterChange, sortBy, sortOrder, onSortChange, onSortOrderChange }) => {
  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-5 p-3 sm:p-4 bg-white rounded-lg border border-[#e9d8fd] box-border">
      <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
        <label htmlFor="status-filter" className="font-medium text-black text-sm whitespace-nowrap">Status:</label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="p-2 border border-[#e9d8fd] rounded-md focus:outline-none focus:shadow-[0_0_0_3px_rgba(158,74,255,0.15)] bg-white text-black min-w-[100px] w-full sm:w-auto text-sm"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
        <label htmlFor="priority-filter" className="font-medium text-black text-sm whitespace-nowrap">Priority:</label>
        <select
          id="priority-filter"
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          className="p-2 border border-[#e9d8fd] rounded-md focus:outline-none focus:shadow-[0_0_0_3px_rgba(158,74,255,0.15)] bg-white text-black min-w-[100px] w-full sm:w-auto text-sm"
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
        <label htmlFor="sort-by" className="font-medium text-black text-sm whitespace-nowrap">Sort by:</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => onSortChange(e)}
          className="p-2 border border-[#e9d8fd] rounded-md focus:outline-none focus:shadow-[0_0_0_3px_rgba(158,74,255,0.15)] bg-white text-black min-w-[100px] w-full sm:w-auto text-sm"
        >
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="createdAt">Created At</option>
        </select>
      </div>
      
      <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
        <label htmlFor="sort-order" className="font-medium text-black text-sm whitespace-nowrap">Order:</label>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e)}
          className="p-2 border border-[#e9d8fd] rounded-md focus:outline-none focus:shadow-[0_0_0_3px_rgba(158,74,255,0.15)] bg-white text-black min-w-[100px] w-full sm:w-auto text-sm"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;