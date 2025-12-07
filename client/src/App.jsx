import { Routes, Route } from 'react-router-dom';
import TodoList from './pages/TodoList';
import TodoDetails from './pages/TodoDetails';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <div className="max-w-[1200px] mx-auto p-5 bg-[#f5f3ff] rounded-lg border border-[#e9d8fd] min-h-screen">
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="/todos/:id" element={<TodoDetails />} />
        </Routes>
      </div>
    </NotificationProvider>
  );
}

export default App;