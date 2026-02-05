# Development Guide

## Prerequisites

- Node.js 16.0.0 or higher
- npm 7.0.0 or higher
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code recommended)

## Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Geo_deshboard
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- react & react-dom (UI framework)
- leaflet (mapping library)
- typescript (type checking)
- vite (build tool)
- @types/leaflet & @types/react (TypeScript definitions)

### 3. Start Development Server
```bash
npm run dev
```

Output:
```
VITE v5.4.21  ready in 434 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

Open http://localhost:5173 in your browser.

## Development Workflow

### File Organization

```
src/
├── components/              # React components
│   ├── App.tsx             # Root component
│   ├── App.css             # App layout styles
│   ├── DataTable.tsx       # Table component
│   ├── DataTable.css       # Table styles
│   ├── GeoMap.tsx          # Map component
│   └── Map.css             # Map styles
├── hooks/                  # Custom hooks
│   └── useTableData.ts     # Table state management
├── data/                   # Data utilities
│   └── mockApi.ts          # Mock API implementation
├── types/                  # TypeScript types
│   └── index.ts            # All type definitions
├── utils/                  # Utility functions
├── main.tsx               # Vite entry point
└── index.css              # Global styles
```

### Adding a New Component

1. **Create component file**
```typescript
// src/components/MyComponent.tsx
import React from 'react';
import './MyComponent.css';

interface MyComponentProps {
  title: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return <div className="my-component">{title}</div>;
};

export default MyComponent;
```

2. **Create styles**
```css
/* src/components/MyComponent.css */
.my-component {
  padding: 1rem;
  background: white;
  border-radius: 4px;
}
```

3. **Import in App**
```typescript
import MyComponent from './components/MyComponent';

// In App component
<MyComponent title="Hello" />
```

### Adding a Custom Hook

1. **Create hook file**
```typescript
// src/hooks/useMyHook.ts
import { useState, useCallback } from 'react';

export const useMyHook = () => {
  const [state, setState] = useState(null);

  const handleAction = useCallback((value) => {
    setState(value);
  }, []);

  return { state, handleAction };
};
```

2. **Use in component**
```typescript
import { useMyHook } from '../hooks/useMyHook';

const MyComponent = () => {
  const { state, handleAction } = useMyHook();
  // ...
};
```

### Adding New Types

```typescript
// src/types/index.ts
export interface NewType {
  id: string;
  name: string;
  // ...
}
```

## Common Development Tasks

### Debugging

**In Browser DevTools:**
1. Open Chrome DevTools (F12)
2. Go to **React DevTools** tab
3. Inspect components and check props/state

**In VS Code:**
1. Install "Debugger for Chrome" extension
2. Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}",
      "sourceMapPathPrefix": "/__vite_source_map__"
    }
  ]
}
```
3. Press F5 to start debugging

### Hot Module Replacement (HMR)

Vite automatically hot-reloads as you edit:
- Save a component file → component hot-reloads
- Save styles → styles update instantly
- Save hooks → state preserved during reload

### Performance Profiling

1. Open Chrome DevTools
2. Go to **Performance** tab
3. Click record, interact with app, click stop
4. Analyze flame graphs and bottlenecks

**React Profiler:**
1. Open **React DevTools**
2. Go to **Profiler** tab
3. Record interactions
4. Identify slow components

## Building for Production

### Build the Project
```bash
npm run build
```

Output:
```
vite v5.4.21 building for production...
✓ 40 modules transformed.
dist/index.html                   0.57 kB │ gzip:  0.34 kB
dist/assets/index-D09xaloq.css    6.15 kB │ gzip:  1.94 kB
dist/assets/index-Jg-277nj.js   301.28 kB │ gzip: 92.33 kB
✓ built in 2.88s
```

### Preview Production Build
```bash
npm run preview
```
Opens the production build at http://localhost:4173

### Analyze Bundle Size
```bash
npm run build -- --analyzeSource false
```

Check `dist/` folder:
- `index.html`: Entry point
- `assets/index-*.css`: Minified styles (~2KB gzip)
- `assets/index-*.js`: Minified JavaScript (~92KB gzip)

## Testing

### Manual Testing Checklist

**Table Features:**
- [ ] Can paginate through pages
- [ ] Can change rows per page
- [ ] Can sort by each column
- [ ] Can search and filter
- [ ] Clicking row selects it
- [ ] Large datasets (50-100 rows) render smoothly

**Map Features:**
- [ ] Map displays correctly
- [ ] Markers appear for all items
- [ ] Clicking marker selects corresponding row
- [ ] Clicking row zooms to marker
- [ ] Popup shows project info

**Synchronization:**
- [ ] Select table row → map updates
- [ ] Click map marker → table updates
- [ ] Visual feedback is clear
- [ ] No lag or stuttering

**Performance:**
- [ ] Initial load < 2 seconds
- [ ] Search responds quickly (after debounce)
- [ ] 50+ items render without lag
- [ ] Scrolling is smooth

### Recommended Testing Tools

**For Unit Tests:**
```bash
npm install --save-dev vitest @testing-library/react
```

**For E2E Tests:**
```bash
npm install --save-dev cypress
npx cypress open
```

**For Visual Regression:**
```bash
npm install --save-dev Percy
```

## Code Style & Conventions

### TypeScript
- Use strict mode (no `any` types)
- Name interfaces with `I` prefix or plain names
- Export types from `types/index.ts`

### React
- Use functional components only
- Use hooks for state management
- Keep components small and focused
- Extract complex logic to custom hooks

### CSS
- Use BEM naming convention
- Scope styles to component
- Use CSS variables for theming
- Mobile-first responsive design

### Naming Conventions
```typescript
// Components: PascalCase
function DataTable() {}

// Functions/variables: camelCase
const handleSort = () => {}
const selectedId = 'project-1'

// Constants: UPPER_SNAKE_CASE
const DEFAULT_PAGE_SIZE = 50

// CSS classes: kebab-case
.data-table-container {}
.btn-primary {}
```

## Environment Variables (Optional)

Create `.env` file for environment-specific settings:
```
VITE_API_BASE_URL=http://api.example.com
VITE_MAP_TILE_URL=https://tile.openstreetmap.org
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Troubleshooting

### Port 5173 Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### TypeScript Errors Not Going Away
```bash
# Rebuild TypeScript
npx tsc --noEmit
```

### Styles Not Updating
1. Clear browser cache (Ctrl+Shift+Del)
2. Force refresh (Ctrl+F5)
3. Restart dev server

### Package Version Conflicts
```bash
# Fix vulnerabilities
npm audit fix

# Force fix with breaking changes
npm audit fix --force
```

## Git Workflow

### Standard Commit Message Format
```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring
- `docs`: Documentation
- `style`: Code style changes
- `perf`: Performance improvements
- `test`: Test additions

**Example:**
```
feat(table): add sorting by multiple columns

- Implement multi-column sort
- Update UI to show sort indicators
- Add tests for sort functionality

Closes #123
```

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Leaflet Documentation](https://leafletjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

## Performance Tips

1. **Minimize Re-renders**
   - Use `useCallback` for event handlers
   - Use `useMemo` for expensive computations
   - Memoize components with `React.memo`

2. **Optimize Data Loading**
   - Implement pagination (done ✓)
   - Debounce search input (done ✓)
   - Cache API responses

3. **CSS Optimization**
   - Minimize CSS file size
   - Use CSS variables instead of repeated values
   - Leverage CSS Grid for layouts

4. **Bundle Optimization**
   - Tree-shake unused imports
   - Use dynamic imports for code splitting
   - Monitor bundle size with `npm run build`

## Getting Help

1. Check browser console for errors
2. Enable React DevTools for debugging
3. Review ARCHITECTURE.md for design decisions
4. Check error messages carefully
5. Search GitHub issues for similar problems

