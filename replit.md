# Overview

Hustle Indexer is a web application that provides fair and transparent evaluations of online hustles and side gigs. The platform allows users to discover, review, and rate various online opportunities through a community-driven scoring system. Users can browse hustles by category, search for specific opportunities, submit reviews with detailed scoring across multiple criteria, and contribute new hustles to the database.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The application uses a modern React-based frontend with TypeScript:

- **React Router**: Uses Wouter for client-side routing
- **UI Framework**: Implements shadcn/ui components built on Radix UI primitives
- **Styling**: TailwindCSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

The frontend follows a component-based architecture with reusable UI components, custom hooks, and a clean separation of concerns. The application is designed to be responsive and accessible.

## Backend Architecture

The backend is built with Express.js and follows a layered architecture:

- **API Layer**: RESTful Express routes handling HTTP requests/responses
- **Storage Layer**: Database abstraction through a storage interface pattern
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas for request validation and type safety

The backend implements proper error handling, request logging, and follows RESTful conventions for API endpoints.

## Database Design

The application uses PostgreSQL with three main entities:

- **Categories**: Organize hustles into different types (e.g., dropshipping, tutoring)
- **Hustles**: Core entities representing online opportunities with metadata like difficulty, hourly rates, and aggregated scores
- **Reviews**: User-submitted evaluations with multi-dimensional scoring (earning potential, time investment, difficulty, legitimacy)

The schema supports advanced features like array fields for tags and requirements, and maintains referential integrity between entities.

## Data Flow and State Management

- Client-side state is managed through TanStack Query for server state and React's built-in state for UI state
- API endpoints follow RESTful patterns with proper HTTP status codes
- Real-time score aggregation happens when reviews are submitted
- Search functionality supports full-text search across hustle names and descriptions

## Authentication and Security

The current implementation includes placeholder authentication UI components, indicating plans for user authentication. The backend uses session-based patterns with PostgreSQL session storage (connect-pg-simple).

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## UI and Design System
- **Radix UI**: Comprehensive set of accessible React components
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **shadcn/ui**: Pre-built component library built on Radix UI

## Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the entire application
- **Replit Integration**: Development environment plugins for Replit platform

## Validation and Forms
- **Zod**: Schema validation library used across frontend and backend
- **React Hook Form**: Form handling with performance optimization
- **@hookform/resolvers**: Integration between React Hook Form and Zod

## Data Fetching and State
- **TanStack Query**: Server state management and caching
- **date-fns**: Date manipulation utilities

The application is designed to be deployed on platforms like Replit with proper environment variable configuration for database connections and other external services.