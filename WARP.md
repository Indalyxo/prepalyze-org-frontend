# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Prepalyze Org Frontend** is a React-based web application for an online examination platform that serves both students and exam organizers. The application features role-based authentication, exam creation/management, anti-cheat monitoring, and comprehensive exam analytics.

## Architecture

### Core Stack
- **Frontend Framework**: React 18 with Vite
- **UI Library**: Mantine v8 (comprehensive React components)
- **State Management**: Zustand for auth + React Query for server state
- **Routing**: React Router DOM v7
- **Styling**: SCSS + CSS Variables + Mantine themes
- **Rich Text**: TipTap editor with extensions
- **HTTP Client**: Axios with interceptors for auth
- **Charts/Analytics**: Recharts + Mantine Charts

### Key Architectural Patterns

**Role-Based Route Protection**: Two distinct user journeys
- `/student/*` - Student dashboard and exam taking interface
- `/organization/*` - Organizer dashboard for exam management and analytics

**Authentication Flow**: JWT-based with automatic token refresh
- Persistent storage using Zustand middleware
- Token expiry detection and automatic refresh
- Network error handling (doesn't logout on network issues)
- Auth store at `src/context/auth-store.js`

**Anti-Cheat System**: Multiple monitoring techniques
- Clipboard blocking (copy/paste disabled)
- Tab switch tracking with violation counting
- Browser focus monitoring
- Watermarking (UI component exists)

**Exam Engine Architecture**:
- Section-based exam structure
- Real-time answer tracking and status management
- Question navigation with visual status indicators
- Timer management with auto-submission
- Multiple question types (Multiple Choice, Numerical)

## Development Commands

### Basic Commands
```bash
# Start development server (runs on port 3001)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint codebase
npm run lint
```

### Environment Setup
The application expects a backend API. Configure in `.env`:
```
VITE_BACKEND_URL=http://localhost:8000
```

## Key Components & Architecture

### Authentication System
- **Auth Store**: `src/context/auth-store.js` - Zustand store with persistence
- **API Client**: `src/utils/api.jsx` - Axios instance with auth interceptors
- **Token Refresh**: Automatic handling with queue system for concurrent requests
- **Network Resilience**: Distinguishes network errors from auth errors

### Exam System
- **ExamInterface**: `src/components/Exam/ExamInterface.jsx` - Main exam taking component
- **Anti-cheat**: `src/utils/AntiCheat/` - Clipboard blocking and tab switch detection
- **Question Types**: Supports Multiple Choice and Numerical input questions
- **Status Management**: Tracks answered, marked for review, visited, and not-visited states
- **Navigation**: Grid-based question navigator with visual status indicators

### Layout System
- **StudentLayout**: `src/layout/StudentLayout/` - Student dashboard wrapper
- **OrganizerLayout**: `src/layout/OrganizerLayout/` - Organizer dashboard wrapper
- **Role-based routing** with authentication guards

### Data Management
- **API Layers**: Organized by domain (groupAPI, userAPI in `api.jsx`)
- **Server State**: React Query for caching and synchronization
- **Local State**: Component-level state for UI interactions
- **Form Handling**: React Hook Form with Zod validation

## Development Guidelines

### Component Structure
- Components follow domain-based organization (`Exam/`, `Organization/`, `Generic/`)
- Reusable components in `components/Generics/`
- Page components in `pages/` with corresponding feature components

### Styling Approach
- CSS Variables for consistent theming (see `exam-interface.scss`)
- Mantine's built-in theming system
- Professional color palette with semantic color usage
- Responsive design with Mantine's Grid system

### State Management Patterns
- Authentication: Zustand with persistence
- Server state: React Query for API data
- Form state: React Hook Form with Zod validation
- Component state: useState for local UI state

### API Integration
- All API calls go through `src/utils/api.jsx`
- Automatic token refresh with request queuing
- Network error handling that preserves user sessions
- Domain-specific API functions (groupAPI, userAPI)

### Anti-Cheat Implementation
- Multiple hooks for different anti-cheat measures
- Configurable violation thresholds
- Toast notifications for violations
- Modal-based warnings and restrictions

## Common Development Tasks

### Adding New Routes
1. Add route definition in `src/App.jsx`
2. Create page component in `src/pages/`
3. Ensure proper authentication guards based on user role
4. Add navigation links in appropriate layout component

### Implementing New Question Types
1. Add question type handling in `src/components/Exam/Helpers/QuestionContent.jsx`
2. Update answer validation logic in `ExamInterface.jsx`
3. Extend question status tracking if needed

### Adding Anti-Cheat Features
1. Create new hook in `src/utils/AntiCheat/`
2. Integrate hook in `ExamInterface.jsx`
3. Add violation handling and UI feedback

### API Integration
1. Add API functions to appropriate section in `src/utils/api.jsx`
2. Use React Query hooks for data fetching in components
3. Handle loading, error, and success states
4. Implement proper error handling for network issues

## Testing Approach

The codebase currently uses basic Vite + React setup. For testing:
- Component testing: Consider React Testing Library
- E2E testing: Consider Playwright for exam flow testing
- Anti-cheat testing: Requires browser automation for tab switching, etc.

## Security Considerations

- JWT tokens stored in localStorage with automatic cleanup
- Anti-cheat measures active during exam sessions
- API endpoints require authentication headers
- Network error handling prevents accidental logouts
- Role-based access control at routing level
