# Todo List Application (Client)

A clean, user-friendly interface for a Todo List app built with React and Vite. This is the frontend client that connects to a separate Node.js Express backend server.

## Features

- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Filter todos by status (all, completed, pending)
- Filter todos by priority (low, medium, high)
- Responsive design that works on mobile and desktop
- Loading states and error handling
- Clean and intuitive UI

## Tech Stack

- **Frontend**: React with Hooks
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **State Management**: React Hooks and Context

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the client directory:
   ```
   cd client
   ```

3. Install dependencies:
   ```
   npm install
   ```

### Running the Application

To start the development server:

```
npm run dev
```

The application will be available at `http://localhost:5173/`.

### Running Tests

To run the test suite:

```
npm test
```

### Building for Production

To create a production build:

```
npm run build
```

### Previewing the Production Build

To preview the production build locally:

```
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── services/        # API service and mock data
├── hooks/           # Custom React hooks
├── App.jsx          # Main application component
└── main.jsx         # Entry point
```

## API Integration

This application connects to a Node.js Express backend server that provides REST API endpoints:

- GET `/todos` - Retrieve all todos with optional filtering
- GET `/todos/{id}` - Retrieve a specific todo
- POST `/todos` - Create a new todo
- PUT `/todos/{id}` - Update an existing todo
- DELETE `/todos/{id}` - Delete a todo
- PUT `/todos/{id}/toggle` - Toggle todo completion status

## Optional Features Implemented

- [x] Client-side filtering in addition to server-side filters
- [x] Sort by due date or priority
- [x] Responsive design (mobile-friendly)
- [x] Basic routing (using React Router)
- [x] Simple tests (Vitest)

## Development Notes

The application follows best practices for React development:
- Component-based architecture
- Functional components with hooks
- Clear separation of concerns
- Proper state management
- Error handling and loading states