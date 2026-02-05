# Architecture Decision Records

## ADR-001: Use Local State Management Instead of Redux

### Context
The project required managing table state (pagination, sorting, filtering) and UI synchronization between table and map components.

### Decision
Implemented local state management using React hooks (useState, useCallback, useEffect, useMemo) without Redux or other state management libraries.

### Rationale
- **Simplicity**: React hooks provide sufficient state management for this use case
- **Performance**: No additional library overhead (reduced bundle size by ~30KB)
- **Maintainability**: Easier to understand and debug without Redux boilerplate
- **Scalability**: Can always refactor to Redux if more features are added later

### Consequences
- Writing custom hooks for complex state logic
- Prop drilling callbacks through components (mitigated using App-level state)
- Clear separation between data logic (hooks) and UI (components)

---

## ADR-002: Choose Leaflet Over Mapbox/OpenLayers

### Context
Multiple mapping libraries available with different trade-offs.

### Decision
Selected Leaflet as the mapping library.

### Rationale
- **Lightweight**: ~40KB (vs Mapbox ~150KB, OpenLayers ~200KB)
- **Open Source**: Community-driven development
- **Performance**: Efficient for rendering 5000+ markers
- **Learning Curve**: Simpler API for this use case
- **Customization**: Easy to customize marker icons and popups

### Consequences
- Cannot use advanced 3D features (not needed for this project)
- Direct DOM manipulation required (wrapped in useEffect hooks)
- No built-in clustering (could add later if needed)

---

## ADR-003: Mock API Over Real Backend

### Context
Assignment requires demonstration of data handling without requiring a production backend.

### Decision
Implemented mock API that generates 5000 records and simulates API behavior.

### Rationale
- **Independence**: No backend dependencies or deployment complexity
- **Testing**: Instant data availability for development
- **Consistency**: Reproducible data across different runs
- **Server-side Ready**: Can swap `fetchProjects()` function with real API call

### Consequences
- All data generation happens in-memory (fine for 5000 records)
- Simulated 300ms latency to mimic real API
- Data is not persistent (resets on page reload)

---

## ADR-004: Vite Over Create React App (CRA)

### Context
Choosing between Vite and CRA for the bundler and development environment.

### Decision
Selected Vite for its superior performance.

### Rationale
- **Build Speed**: Vite builds 3-5x faster than CRA
- **Dev Server**: Instant HMR (Hot Module Replacement)
- **Bundle Size**: Smaller production bundles (92KB vs ~150KB)
- **Modern**: Uses native ES modules and esbuild
- **Future-Proof**: Actively maintained and widely adopted

### Consequences
- Requires Node 16+ (modern requirement)
- Different configuration structure than CRA
- Smaller ecosystem compared to CRA (but improving rapidly)

---

## ADR-005: CSS Modules vs Tailwind vs Plain CSS

### Context
Styling approach for the application.

### Decision
Implemented plain CSS with scoped class names (BEM convention).

### Rationale
- **Simplicity**: No build-time transpilation requirements
- **Learning**: CSS knowledge applies directly
- **Customization**: Full control over styling
- **Performance**: No CSS-in-JS runtime overhead
- **Accessibility**: Easy to ensure proper color contrasts and ARIA labels

### Consequences
- Manual class naming and organization required
- Global scope for CSS (mitigated using BEM naming)
- More CSS code compared to utility-first approaches like Tailwind

---

## ADR-006: Component Folder Structure

### Context
Organizing code into logical folders for maintainability.

### Decision
```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── types/         # TypeScript interfaces
├── data/          # Data utilities
├── utils/         # Helper functions
```

### Rationale
- **Clarity**: Clear purpose for each folder
- **Scalability**: Easy to locate and add new features
- **Separation**: UI, data, types, and utilities clearly separated
- **Convention**: Follows industry best practices

### Consequences
- More folders than single-file projects
- Requires discipline to maintain structure
- May be overkill for very small projects

---

## ADR-007: Client-Side Filtering vs Server-Side Filtering

### Context
Handling search and filter operations for 5000 records.

### Decision
Implemented client-side filtering with debounced search input.

### Rationale
- **Performance**: Instant search feedback (after 300ms debounce)
- **No Network Calls**: Reduced server load and latency
- **Better UX**: User sees results immediately
- **Simplicity**: No complex server-side query parsing needed

### Consequences
- All 5000 records must be loaded in memory
- Filtering performance depends on browser capabilities
- Not suitable for datasets > 100k records (would refactor to server-side then)

---

## ADR-008: TypeScript Strict Mode

### Context
Choosing TypeScript strictness level.

### Decision
Enabled strict mode with no implicit `any` types allowed.

### Rationale
- **Type Safety**: Catches more errors at compile time
- **Developer Experience**: IDE autocomplete and error checking
- **Maintainability**: Code intent is explicit through types
- **Refactoring**: Large refactors are safer with full type coverage

### Consequences
- Slightly more verbose code with explicit types
- Longer compilation time (minimal impact with Vite)
- Steeper learning curve for new developers

---

## Future Architectural Decisions

### Virtual Scrolling
If dataset exceeds 100k rows, implement virtual scrolling:
```typescript
import { FixedSizeList as List } from 'react-window';
```

### Real-Time Updates
For live data, implement WebSocket integration:
```typescript
const socket = io('ws://api.example.com');
socket.on('data-updated', (newProject) => {
  // Update state
});
```

### State Persistence
Persist user preferences (page size, sort order):
```typescript
localStorage.setItem('tableState', JSON.stringify(state));
```

### Error Handling
Comprehensive error boundaries and retry logic:
```typescript
class ErrorBoundary extends React.Component {
  // Handle component errors
}
```

---

## Summary Table

| Decision | Choice | Alternative | Reason |
|----------|--------|-------------|--------|
| State Management | React Hooks | Redux, MobX | Simplicity for this scope |
| Map Library | Leaflet | Mapbox, OpenLayers | Lightweight & performance |
| API | Mock API | Real backend | No external dependencies |
| Bundler | Vite | CRA, Webpack | Speed & modern approach |
| Styling | Plain CSS | Tailwind, Styled-components | Full control & simplicity |
| Data Filtering | Client-side | Server-side | Better user experience |
| Type Checking | TypeScript Strict | Loose or disabled | Maximum type safety |
