import { useState, useCallback } from 'react';
import { GeoProject, TableState, ApiResponse } from '../types';
import { fetchProjects } from '../data/mockApi';

export const useTableData = () => {
  const [data, setData] = useState<GeoProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: 50,
    sortBy: null,
    sortOrder: 'asc',
    filterText: '',
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response: ApiResponse = await fetchProjects(
        state.page,
        state.pageSize,
        state.sortBy || undefined,
        state.sortOrder
      );
      setData(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [state.page, state.pageSize, state.sortBy, state.sortOrder]);

  const handleSearch = useCallback((text: string) => {
    setState((prev) => ({
      ...prev,
      filterText: text,
      page: 1,
    }));
  }, []);

  const handleSort = useCallback((column: keyof GeoProject) => {
    setState((prev) => ({
      ...prev,
      sortBy: prev.sortBy === column ? column : column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setState((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setState((prev) => ({
      ...prev,
      pageSize,
      page: 1,
    }));
  }, []);

  const handleRowSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return {
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
  };
};
