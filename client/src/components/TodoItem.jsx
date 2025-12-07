import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const todoRef = useRef(null);

  // Ensure we have a valid ID
  const todoId = todo.id || todo._id;

  const handleToggle = () => {
    if (todoId) {
      onToggle(todoId, !todo.is_completed);
    }
  };

  const handleViewDetails = () => {
    if (todoId) {
      navigate(`/todos/${todoId}`);
    }
  };

  const handleEdit = () => {
    if (todoId) {
      onEdit(todo);
    }
  };

  const handleDelete = () => {
    if (todoId && window.confirm('Are you sure you want to delete this todo?')) {
      onDelete(todoId);
    }
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Left swipe - show delete confirmation
      if (todoId && window.confirm('Are you sure you want to delete this todo?')) {
        onDelete(todoId);
      }
    } else if (isRightSwipe) {
      // Right swipe - edit todo
      if (todoId) {
        onEdit(todo);
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-[#fee2e2] text-[#b91c1c]';
      case 'medium':
        return 'bg-[#ede9fe] text-[#8a36e6]';
      case 'low':
        return 'bg-[#e9d5ff] text-[#9333ea]';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-[#e9d8fd] mb-3 sm:mb-4 transition-all duration-200 outline-none ${todo.is_completed ? 'opacity-70' : ''} hover:shadow-[0_2px_4px_rgba(158,74,255,0.15)] hover:-translate-y-0.5`}
      ref={todoRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex gap-3 sm:gap-4 flex-1 w-full">
        <input
          type="checkbox"
          checked={todo.is_completed}
          onChange={handleToggle}
          className="mt-1 self-start h-5 w-5"
        />
        <div className="flex-1">
          <h3 className={`m-0 text-base sm:text-lg text-black ${todo.is_completed ? 'line-through text-[#b27bff]' : ''}`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className="m-0 mb-2 text-sm text-[#333333]">
              {todo.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {todo.priority && (
              <span className={`py-0.5 px-2 rounded-2xl text-xs font-medium uppercase ${getPriorityClass(todo.priority)}`}>
                {todo.priority}
              </span>
            )}
            {todo.due_date && (
              <span className="text-xs text-[#666666]">
                Due: {formatDate(todo.due_date)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button onClick={handleViewDetails} className="py-1.5 px-2.5 text-xs sm:text-sm rounded cursor-pointer border-none transition-all duration-200 bg-[#ede9fe] text-black hover:bg-[#c4b5fd] hover:-translate-y-0.5 flex-1 sm:flex-none todo-btn">
          View
        </button>
        <button onClick={handleEdit} className="py-1.5 px-2.5 text-xs sm:text-sm rounded cursor-pointer border-none transition-all duration-200 bg-[#e9d5ff] text-black hover:bg-[#d8b4fe] hover:-translate-y-0.5 flex-1 sm:flex-none todo-btn">
          Edit
        </button>
        <button onClick={handleDelete} className="py-1.5 px-2.5 text-xs sm:text-sm rounded cursor-pointer border-none transition-all duration-200 bg-[#fee2e2] text-[#b91c1c] hover:bg-[#fecaca] hover:-translate-y-0.5 flex-1 sm:flex-none todo-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;