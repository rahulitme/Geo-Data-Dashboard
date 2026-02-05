import { GeoProject, ApiResponse } from '../types';

const statuses: Array<'Active' | 'Inactive' | 'Completed' | 'Pending'> = ['Active', 'Inactive', 'Completed', 'Pending'];

// Generate mock data with 5000+ records
const generateMockData = (): GeoProject[] => {
  const data: GeoProject[] = [];
  const projectNames = [
    'Solar Farm Alpha',
    'Wind Energy Beta',
    'Hydroelectric Project',
    'Geothermal Station',
    'Biomass Facility',
    'Grid Infrastructure',
    'Smart City Initiative',
    'Environmental Survey',
    'Resource Mapping',
    'Climate Analysis',
    'Urban Planning Zone',
    'Agricultural Census',
    'Mineral Exploration',
    'Water Resource Study',
    'Coastal Management',
  ];

  for (let i = 0; i < 5000; i++) {
    const lat = Math.random() * 180 - 90;
    const lng = Math.random() * 360 - 180;
    
    data.push({
      id: `project-${i + 1}`,
      projectName: `${projectNames[i % projectNames.length]} ${Math.floor(i / projectNames.length) + 1}`,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastUpdated: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  }

  return data;
};

// Cache for mock data
let cachedData: GeoProject[] | null = null;

const getMockData = (): GeoProject[] => {
  if (!cachedData) {
    cachedData = generateMockData();
  }
  return cachedData;
};

export const fetchProjects = (
  page: number,
  pageSize: number,
  sortBy?: keyof GeoProject,
  sortOrder?: 'asc' | 'desc',
  filterText?: string
): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      let data = getMockData();

      // Apply filtering
      if (filterText?.trim()) {
        const filter = filterText.toLowerCase();
        data = data.filter((project) =>
          project.projectName.toLowerCase().includes(filter) ||
          project.status.toLowerCase().includes(filter) ||
          project.id.toLowerCase().includes(filter)
        );
      }

      // Apply sorting
      if (sortBy) {
        data = [...data].sort((a, b) => {
          const aVal = a[sortBy];
          const bVal = b[sortBy];

          if (typeof aVal === 'string') {
            return sortOrder === 'asc'
              ? aVal.localeCompare(bVal as string)
              : (bVal as string).localeCompare(aVal);
          }

          return sortOrder === 'asc'
            ? (aVal as number) - (bVal as number)
            : (bVal as number) - (aVal as number);
        });
      }

      // Apply pagination
      const startIdx = (page - 1) * pageSize;
      const endIdx = startIdx + pageSize;
      const paginatedData = data.slice(startIdx, endIdx);

      resolve({
        data: paginatedData,
        total: data.length,
        page,
        pageSize,
      });
    }, 300);
  });
};
