import React, { useMemo } from 'react';
import { GeoProject, TableState } from '../types';
import './DataTable.css';

interface DataTableProps {
  data: GeoProject[];
  loading: boolean;
  total: number;
  state: TableState;
  selectedId: string | null;
  onSort: (column: keyof GeoProject) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowSelect: (id: string) => void;
  onFilter: (text: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  loading,
  total,
  state,
  selectedId,
  onSort,
  onPageChange,
  onPageSizeChange,
  onRowSelect,
  onFilter,
}) => {
  const totalPages = Math.ceil(total / state.pageSize);

  // Filter data on the client side
  const filteredData = useMemo(() => {
    if (!state.filterText.trim()) return data;
    
    const filter = state.filterText.toLowerCase();
    return data.filter((project) =>
      project.projectName.toLowerCase().includes(filter) ||
      project.status.toLowerCase().includes(filter) ||
      project.id.toLowerCase().includes(filter)
    );
  }, [data, state.filterText]);

  const getSortIndicator = (column: keyof GeoProject) => {
    if (state.sortBy !== column) return '';
    return state.sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="data-table-container">
      <div className="table-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, status, or ID..."
            value={state.filterText}
            onChange={(e) => onFilter(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="pagination-controls">
          <label>
            Rows per page:
            <select value={state.pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </label>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => onSort('projectName')} className="sortable">
                Project Name {getSortIndicator('projectName')}
              </th>
              <th onClick={() => onSort('latitude')} className="sortable">
                Latitude {getSortIndicator('latitude')}
              </th>
              <th onClick={() => onSort('longitude')} className="sortable">
                Longitude {getSortIndicator('longitude')}
              </th>
              <th onClick={() => onSort('status')} className="sortable">
                Status {getSortIndicator('status')}
              </th>
              <th onClick={() => onSort('lastUpdated')} className="sortable">
                Last Updated {getSortIndicator('lastUpdated')}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loading-row">
                <td colSpan={5}>Loading...</td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={5}>No data available</td>
              </tr>
            ) : (
              filteredData.map((project) => (
                <tr
                  key={project.id}
                  className={`data-row ${selectedId === project.id ? 'selected' : ''}`}
                  onClick={() => onRowSelect(project.id)}
                >
                  <td>{project.projectName}</td>
                  <td>{project.latitude.toFixed(4)}</td>
                  <td>{project.longitude.toFixed(4)}</td>
                  <td>
                    <span className={`status-badge status-${project.status.toLowerCase()}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>{project.lastUpdated}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-footer">
        <div className="pagination-info">
          {total > 0 ? (
            <>
              Showing {(state.page - 1) * state.pageSize + 1} to{' '}
              {Math.min(state.page * state.pageSize, total)} of {total} results
            </>
          ) : (
            'No results'
          )}
        </div>

        <div className="pagination-buttons">
          <button onClick={() => onPageChange(1)} disabled={state.page === 1} className="btn btn-sm">
            First
          </button>
          <button onClick={() => onPageChange(state.page - 1)} disabled={state.page === 1} className="btn btn-sm">
            Previous
          </button>

          <span className="page-info">
            Page {state.page} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(state.page + 1)}
            disabled={state.page >= totalPages}
            className="btn btn-sm"
          >
            Next
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={state.page >= totalPages}
            className="btn btn-sm"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
