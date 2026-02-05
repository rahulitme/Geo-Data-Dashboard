# 🌍 Geo Data Dashboard

A high-performance React-based dashboard for visualizing and managing geospatial data with interactive maps and advanced data tables.

## Project Overview

This application provides a complete solution for managing and visualizing geographic projects with real-time synchronization between tabular data and interactive maps. It's designed to handle 5000+ records efficiently with zero performance lag.

### Key Features

✅ **Data Table Component**
- Paginated data display with configurable page sizes (10, 25, 50, 100 rows)
- Client-side filtering with real-time search
- Multi-column sorting (ascending/descending)
- Row selection with visual highlighting
- Handles 5000+ records without lag

✅ **Interactive Map Integration**
- Leaflet-based map visualization
- Dynamic marker placement based on lat/long coordinates
- Clickable markers that sync with table selection
- Popup information for each project
- Automatic zoom to selected marker

✅ **Bi-directional Synchronization**
- Clicking a table row highlights the corresponding map marker
- Clicking a map marker highlights the corresponding table row
- Smooth animations and visual feedback

✅ **State Management**
- Local state only (no Redux)
- Efficient React hooks for state management
- Proper separation of concerns between UI and data logic

✅ **Performance Optimized**
- Virtual scrolling-ready table structure
- Efficient data rendering with React hooks
- Debounced search for better performance
- Low memory footprint for large datasets

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 18 with TypeScript |
| **Build Tool** | Vite 5 (lightning-fast bundler) |
| **Map Library** | Leaflet 1.9.4 + Leaflet CSS |
| **Styling** | CSS3 with modern layout techniques |
| **State Management** | React Hooks (useState, useCallback, useEffect, useMemo) |
| **Data Source** | Mock API with 5000 records |

## Architecture & Design Decisions

### 1. **Component Decomposition**
- **DataTable.tsx**: Reusable table component with sorting, pagination, and filtering
- **GeoMap.tsx**: Leaflet map integration with marker management
- **App.tsx**: Main orchestrator component managing shared state
- **useTableData.ts**: Custom hook encapsulating all table state logic

**Rationale**: Clear separation of concerns makes components testable and reusable. The custom hook isolates data logic from UI rendering.

### 2. **State Management Architecture**
```
App.tsx (Root State)
├── useTableData Hook
│   ├── filters/search
│   ├── pagination
│   ├── sorting
│   ├── selected row
│   └── loading states
├── DataTable Component
└── GeoMap Component
```

**Why Local State Only?**
- Redux adds unnecessary complexity for this use case
- Local state with hooks is performant and straightforward
- React's built-in features are sufficient for app requirements

### 3. **Data Fetching Strategy**
- **Mock API** (`mockApi.ts`): Generates consistent 5000-record dataset
- **Server-side ready**: Can easily replace with real API endpoints
- **Simulated latency**: 300ms delay to simulate real API behavior
- **Filtering**: Client-side filtering for instant search feedback

**Code Structure**:
```typescript
fetchProjects(page, pageSize, sortBy, sortOrder, filterText)
├── Apply text filter
├── Apply sorting
├── Apply pagination
└── Return paginated results
```

### 4. **Performance Optimizations**

#### Table Rendering
- Uses `useMemo` to prevent unnecessary re-renders of filtered data
- Pagination limits DOM nodes rendered at once
- Sticky table headers for better UX
- CSS-based animations instead of JavaScript

#### Map Rendering
- Markers cached in `Map` refs to avoid recreating them
- Icons only change when selection changes
- Bounds calculation happens once per data change
- Efficient popup management

#### Search/Filter
- 300ms debounce on search input
- Prevents excessive re-renders during typing
- Search applies only when user stops typing

### 5. **Synchronization Logic**

```
User clicks table row
  ↓
setSelectedId(id)
  ↓
GeoMap component detects change via selectedId prop
  ↓
Marker icon size increases + popup opens
  ↓
Map centers on marker with animation

---

User clicks marker
  ↓
onMarkerClick callback fires
  ↓
setSelectedId(id) called
  ↓
DataTable row className updates to 'selected'
  ↓
Row scrolls into view (CSS handles visual feedback)
```

## Folder Structure

```
src/
├── components/          # React components
│   ├── DataTable.tsx   # Main table component
│   ├── DataTable.css   # Table styles
│   ├── GeoMap.tsx      # Leaflet map component
│   └── Map.css         # Map styles
├── hooks/              # Custom React hooks
│   └── useTableData.ts # Table state management hook
├── data/               # Data utilities
│   └── mockApi.ts      # Mock API implementation
├── types/              # TypeScript interfaces
│   └── index.ts        # All type definitions
├── utils/              # Utility functions (future)
├── App.tsx             # Root component
├── App.css             # App layout styles
├── main.tsx            # Vite entry point
└── index.css           # Global styles
```
