# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**climate-project-frontend** is a React 19 frontend application for a climate-focused integrated search website. The project uses Vite as the build tool and follows modern JavaScript/React best practices. The codebase is currently in an early-stage boilerplate state with placeholder code ready for feature development.

**Tech Stack:**
- React 19.1.1 with React DOM
- Vite 7.1.7 (build tool and dev server)
- ESLint 9.36.0 (code quality)
- ES2020+ with JSX support

## Essential Commands

### Development
```bash
npm run dev      # Start development server with hot reload (http://localhost:5173)
npm run lint     # Run ESLint to check code quality
npm run build    # Create optimized production build (outputs to dist/)
npm run preview  # Preview production build locally
```

### Common Workflows
```bash
# Fix linting errors automatically
npm run lint -- --fix

# Run linting on specific files
npm run lint src/components/

# Build and test production output
npm run build && npm run preview
```

## Project Structure

```
src/
├── assets/           # Static images and SVGs
├── App.jsx          # Root React component
├── App.css          # App component styles
├── main.jsx         # Application entry point (creates React root)
└── index.css        # Global styles and theme variables

public/             # Static files served directly by Vite
index.html          # HTML entry point (loads main.jsx)
```

## Architecture & Key Concepts

### React Entry Point Flow
1. **index.html** - HTML entry point with `<div id="root"></div>`
2. **src/main.jsx** - Mounts React app: `ReactDOM.createRoot(root).render(<App />)`
3. **src/App.jsx** - Root component; all features branch from here

### Development Server
- **Vite + React Plugin** - Provides Fast Refresh (module-level hot reload, preserves component state)
- Changes to JSX/CSS auto-refresh browser without full page reload
- Fast startup and rebuild times due to native ES modules

### Build Output
- Vite optimizes and bundles everything to `dist/` directory
- Output is a single HTML file with embedded/referenced CSS and JS bundles
- Ready for static hosting or CDN deployment

## Code Quality Standards

**ESLint Configuration** (eslint.config.js):
- **Coverage:** All .js and .jsx files
- **Extends:**
  - `@eslint/js` recommended rules
  - `eslint-plugin-react-hooks` (latest) - enforces Hooks best practices
  - `eslint-plugin-react-refresh` (Vite config) - prevents issues with React Fast Refresh
- **Language:** ES2020+, JSX enabled
- **Custom Rules:**
  - `no-unused-vars` error with pattern exception: uppercase and underscore-prefixed names are allowed (for intentional unused variables like `_unused` or `CONSTANT`)

**Always run `npm run lint` before committing** to maintain code quality.

## Environment Setup

The project uses Vite's environment variable support via `.env` files:
- `.env` - Default environment variables
- `.env.local` - Local overrides (not committed)
- `.env.production` - Production-specific variables
- Access in code via `import.meta.env.VITE_*`

## Development Notes

### Hot Module Replacement (HMR)
- React Fast Refresh preserves component state during edits
- CSS changes update instantly without page reload
- Use `npm run dev` for optimal development experience

### Adding Dependencies
- `npm install <package>` for production dependencies
- `npm install --save-dev <package>` for dev dependencies
- Update `package.json` is committed; `package-lock.json` locks versions

### Performance Considerations
- Vite lazy-loads modules on demand during development
- Production builds are optimized with tree-shaking and minification
- Consider code splitting for large features (use dynamic imports)
