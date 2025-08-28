# Frontend

A modern React application that combines feature-based and page-based architecture to provide a high-performance, maintainable user interface.

## Tech Stack

- **Core Framework**: React 19
- **State Management**: Redux Toolkit
- **Routing**: React Router 7
- **UI Components**: Material UI 7
- **Data Fetching**: TanStack Query (React Query) 5
- **Form Handling**: React Hook Form 7
- **Type System**: TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **Data Validation**: Zod
- **Code Quality**: ESLint + Prettier

## Project Structure

The project uses a hybrid of feature-based and page-based architecture:

```
src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Shared components
├── features/       # Feature modules (organized by business function)
│   ├── auth/       # Authentication functionality
│   └── dashboard/  # Dashboard functionality
├── hooks/          # Custom React hooks
├── layouts/        # Layout components
├── pages/          # Page components (directly correspond to routes)
├── redux/          # Redux configuration
├── utils/          # Utility functions
├── App.tsx         # Root application component
└── main.tsx        # Application entry point
```

### Feature-Based & Page-Based Combination

- **pages/**: Handles route configuration and page entry points, with each page corresponding to a route
- **features/**: Organizes code by business functionality, each feature being a self-contained module
  - Can include components, hooks, state, APIs, etc.
  - High cohesion, independently maintainable

This structure balances intuitive page navigation with functional module cohesion, facilitating team collaboration and code maintenance.

## Development Guide

### Requirements

- Node.js ≥ 22.0.0
- npm ≥ 10.0.0

### Common Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build production version
pnpm run build

# Run code linting
pnpm run lint

# Format code
pnpm run format

# Run tests
pnpm run test
```

## Coding Standards

The project uses ESLint and Prettier to ensure code quality and consistency:

- React components use arrow function style
- TypeScript for strong typing
- Functional programming principles
- Avoid using React.FC type

## State Management

Redux Toolkit is used for global state management with the following structure:

```
redux/
├── store.ts          # Store configuration
├── slices/           # Redux slices
└── hooks.ts          # Type-safe hooks
```

## Performance Optimization

- Route code splitting
- React.memo optimization
- useMemo and useCallback caching
- Virtualized lists for large data sets

## Testing Strategy

Using Vitest and Testing Library for component testing, focusing on functionality rather than implementation details.

## Deployment

The project configuration supports multiple deployment environments:

- Development: Local development server
- Testing: CI integration tests
- Production: Optimized static assets

## Storybook

- update dependency

```bash
pnpm install
```

- run storybook

```bash
npm run storybook
```

- check in browser(http://localhost:6006/)

- new component
  use file name xxx.stories.tsx


#testci