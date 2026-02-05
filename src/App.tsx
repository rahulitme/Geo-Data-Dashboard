import { useEffect, useMemo } from 'react';
import DataTable from './components/DataTable';
import GeoMap from './components/GeoMap';
import InfoPanel from './components/InfoPanel';
import { useTableData } from './hooks/useTableData';
import './App.css';

function App() {
  const {
    data,
    loading,
    total,
    state,
    selectedId,
    loadData,
    handleSearch,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleRowSelect,
  } = useTableData();

  // Find selected project
  const selectedProject = useMemo(() => {
    if (!selectedId) return null;
    return data.find((project) => project.id === selectedId) || null;
  }, [selectedId, data]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, [state.page, state.pageSize, state.sortBy, state.sortOrder, loadData]);

  // Refetch when filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [state.filterText, loadData]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🌍 Geo Data Dashboard</h1>
          <p>Explore spatial data with interactive maps and advanced filtering</p>
        </div>
      </header>

      <div className="app-body">
        <div className="table-section">
          <h2>Projects Database</h2>
          <DataTable
            data={data}
            loading={loading}
            total={total}
            state={state}
            selectedId={selectedId}
            onSort={handleSort}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRowSelect={handleRowSelect}
            onFilter={handleSearch}
          />
        </div>

        <div className="map-section">
          <h2>Geographic View</h2>
          <GeoMap data={data} selectedId={selectedId} onMarkerClick={handleRowSelect} />
        </div>

        <div className="info-section">
          <h2>Project Information</h2>
          <InfoPanel selectedProject={selectedProject} />
        </div>
      </div>

      <footer className="app-footer">
        <p>Geo Data Dashboard © 2026 | Built with React + Leaflet</p>
      </footer>
    </div>
  );
}

export default App;
