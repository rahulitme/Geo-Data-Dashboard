export interface GeoProject {
  id: string;
  projectName: string;
  latitude: number;
  longitude: number;
  status: 'Active' | 'Inactive' | 'Completed' | 'Pending';
  lastUpdated: string;
}

export interface ApiResponse {
  data: GeoProject[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TableState {
  page: number;
  pageSize: number;
  sortBy: keyof GeoProject | null;
  sortOrder: 'asc' | 'desc';
  filterText: string;
}
