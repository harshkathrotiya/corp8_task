# Todo List Application - Frontend Assignment

A full-stack Todo List application with a clean, user-friendly React frontend and Node.js Express backend, deployed on Vercel.

**Live Demo:** [https://corptodo.vercel.app](https://corptodo.vercel.app)

---

## 📋 Assignment Overview

**Role:** Frontend Engineer  
**Goal:** Build a clean, user-friendly interface for a Todo List app that consumes a REST API.

This project implements all required features and several optional enhancements.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Routing:** React Router DOM 7.10.1
- **Styling:** Tailwind CSS (via CDN)
- **State Management:** React Hooks (useState, useEffect, custom hooks)
- **Date Handling:** date-fns 4.1.0

### Backend (Implemented)
- **Runtime:** Node.js 18+
- **Framework:** Express 5.2.1
- **Database:** MongoDB Atlas
- **Deployment:** Vercel Serverless Functions

### Testing
- **Test Framework:** Vitest 4.0.15
- **DOM Testing:** jsdom 27.2.0

---

## ✨ Features Implemented

### Required Features ✅

#### 1. Todo List View
- ✅ Display todos in card format showing:
  - Title
  - Priority (with color-coded badges)
  - Due date (formatted with relative time)
  - Completion state
- ✅ Mark todos as completed/incomplete (toggle)
- ✅ Filter by:
  - Status: All / Completed / Pending
  - Priority: Low / Medium / High

#### 2. Create Todo
- ✅ Form with validation:
  - Title (required)
  - Description (optional)
  - Due date (optional, with date picker)
  - Priority (dropdown: low/medium/high)

#### 3. Edit Todo
- ✅ Modal-based editing
- ✅ Pre-filled form with existing data
- ✅ Update all fields

#### 4. Delete Todo
- ✅ Delete with confirmation modal
- ✅ Success feedback

#### 5. UX Requirements
- ✅ Loading states (spinner during API calls)
- ✅ Error handling with toast notifications
- ✅ Success feedback messages
- ✅ Optimistic UI updates

### Optional Features ✅

- ✅ **Client-side search** - Real-time search across title and description
- ✅ **Sort by due date and priority** - Multiple sorting options
- ✅ **Responsive design** - Mobile-friendly with touch-optimized UI
- ✅ **Routing** - `/` for list, `/todo/:id` for details
- ✅ **Tests** - Unit tests for API service and components
- ✅ **Progress indicator** - Visual completion percentage
- ✅ **Toast notifications** - Non-intrusive feedback system

---

## 🏗️ Project Structure

```
corp8_task/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProgressIndicator.jsx
│   │   │   ├── ToastNotification.jsx
│   │   │   ├── TodoForm.jsx
│   │   │   └── TodoItem.jsx
│   │   ├── contexts/         # React Context providers
│   │   │   └── NotificationContext.jsx
│   │   ├── hooks/            # Custom React hooks
│   │   │   └── useTodos.js
│   │   ├── pages/            # Route components
│   │   │   ├── TodoList.jsx
│   │   │   └── TodoDetails.jsx
│   │   ├── services/         # API integration
│   │   │   ├── api.js
│   │   │   └── api.test.js
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                    # Express backend
│   ├── controllers/
│   │   └── todoController.js
│   ├── models/
│   │   └── Todo.js
│   ├── index.vercel.js       # Serverless function
│   └── package.json
├── api/                       # Vercel serverless entry
│   └── index.js
├── vercel.json               # Vercel configuration
└── README.md
```

---

## 📡 API Specification

The backend implements the exact API specification from the assignment:

### Todo Model
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "due_date": "ISO 8601 datetime",
  "priority": "low | medium | high",
  "is_completed": boolean,
  "created_at": "ISO 8601 datetime",
  "updated_at": "ISO 8601 datetime"
}
```

### Endpoints

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/todos` | List all todos | `status`, `priority` |
| GET | `/api/todos/:id` | Get single todo | - |
| POST | `/api/todos` | Create new todo | - |
| PUT | `/api/todos/:id` | Update todo | - |
| DELETE | `/api/todos/:id` | Delete todo | - |
| PUT | `/api/todos/:id/toggle` | Toggle completion | - |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:harshkathrotiya/corp8_task.git
   cd corp8_task
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

### Running Locally

#### Option 1: Full Stack (Recommended)

Run both frontend and backend concurrently:

```bash
# From root directory
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

#### Option 2: Frontend Only

```bash
cd client
npm run dev
```

The frontend will proxy API requests to `http://localhost:3001`.

#### Option 3: Backend Only

```bash
cd server
npm run dev
```

### Environment Variables

Create `server/.env`:
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
```

---

## 🧪 Running Tests

```bash
cd client
npm test
```

Tests include:
- API service unit tests
- Component tests
- Integration tests

---

## 🎨 UI/UX Highlights

### Design Principles
- **Clean & Minimal:** Focus on usability over decoration
- **Responsive:** Mobile-first design with touch-optimized controls
- **Accessible:** Proper contrast, keyboard navigation, ARIA labels
- **Feedback:** Loading states, error handling, success messages

### Color Coding
- **High Priority:** Red badge
- **Medium Priority:** Yellow badge
- **Low Priority:** Green badge
- **Completed:** Green checkmark with strikethrough

### Interactions
- **Hover effects** on interactive elements
- **Smooth transitions** for state changes
- **Modal dialogs** for create/edit/delete
- **Toast notifications** for feedback
- **Calendar picker** for due dates

---

## 🔧 State Management

### Approach
- **Local State:** `useState` for component-level state
- **Custom Hooks:** `useTodos` for todo data management
- **Context API:** `NotificationContext` for global toast notifications
- **URL State:** React Router for navigation state

### Data Flow
```
User Action → Component → useTodos Hook → API Service → Backend → MongoDB
                ↓                                          ↓
            Local State Update ← Response ← ← ← ← ← ← ← ←
                ↓
            UI Re-render
```

---

## 🌐 API Integration

### Implementation
- **Service Layer:** Centralized in `services/api.js`
- **Error Handling:** Try-catch with user-friendly messages
- **Loading States:** Tracked per operation
- **Optimistic Updates:** Immediate UI feedback

### Example
```javascript
// services/api.js
export async function getAllTodos(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  
  const response = await fetch(`${API_BASE_URL}/todos?${params}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

---

## 📦 Build & Deployment

### Build for Production

```bash
# Build client
cd client
npm run build

# Output: client/dist/
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Environment Variables (Vercel):**
- `MONGODB_URI` - MongoDB Atlas connection string

---

## ✅ Assignment Checklist

### Required Features
- [x] Todo List View with filtering
- [x] Create Todo form
- [x] Edit Todo functionality
- [x] Delete Todo with confirmation
- [x] Loading states
- [x] Error handling
- [x] Success feedback

### Optional Features
- [x] Client-side search
- [x] Sort by due date/priority
- [x] Responsive design
- [x] Routing (/, /todo/:id)
- [x] Tests (Vitest)

### Code Quality
- [x] Component-based structure
- [x] Clear naming conventions
- [x] Functional components with hooks
- [x] Logical organization
- [x] Clean, readable code

---

## 🎯 Key Implementation Decisions

### Why React?
- Modern, widely-used framework
- Excellent ecosystem and tooling
- Great for component-based architecture
- Strong TypeScript support (if needed)

### Why Vite?
- Fast development server
- Optimized production builds
- Better DX than Create React App
- Native ES modules support

### Why Tailwind CSS?
- Rapid UI development
- Consistent design system
- Small production bundle
- Easy to customize

### Why MongoDB?
- Flexible schema for todos
- Easy to scale
- Great cloud hosting (Atlas)
- Native JSON support

---

## 📝 Notes

### Backend Implementation
While the assignment allowed mocking the API, I implemented a full backend because:
1. Demonstrates full-stack capabilities
2. Provides real data persistence
3. Shows proper API design
4. Enables realistic testing

### Deployment
The app is deployed on Vercel as a serverless application:
- Frontend: Static files served via CDN
- Backend: Serverless functions (auto-scaling)
- Database: MongoDB Atlas (cloud-hosted)

---

## 🐛 Known Limitations

- No authentication/authorization (not in scope)
- No pagination (works well for moderate data)
- No offline support (requires internet)
- No real-time updates (no WebSocket)

---

## 🚀 Future Enhancements

- [ ] Add user authentication
- [ ] Implement drag-and-drop reordering
- [ ] Add todo categories/tags
- [ ] Enable recurring todos
- [ ] Add file attachments
- [ ] Implement dark mode
- [ ] Add keyboard shortcuts
- [ ] Enable collaborative editing

---

## 📄 License

ISC

---

## 👤 Author

**Harsh Kathrotiya**

- GitHub: [@harshkathrotiya](https://github.com/harshkathrotiya)
- Repository: [corp8_task](https://github.com/harshkathrotiya/corp8_task)

---

## 🙏 Acknowledgments

Built as part of a frontend engineering assignment to demonstrate:
- React proficiency
- API integration skills
- UI/UX design capabilities
- Code organization and quality
- Full-stack development knowledge
