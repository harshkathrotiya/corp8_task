import React, { useState, useMemo, useEffect } from 'react';
import { useTodos } from '../hooks/useTodos';
import { useNotification } from '../contexts/NotificationContext';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import ProgressIndicator from '../components/ProgressIndicator';

const TodoList = () => {
  const {
    todos,
    loading,
    error,
    filters,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompletion,
    updateFilters
  } = useTodos();

  const { addNotification } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, priority, createdAt
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generate autocomplete suggestions based on todo titles, descriptions, and priorities
  const suggestions = useMemo(() => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase().trim();
    const allTerms = new Set();

    todos.forEach(todo => {
      // Add title words
      todo.title.toLowerCase().split(' ').forEach(word => {
        if (word.includes(query) && word.length > 2) {
          allTerms.add(todo.title);
        }
      });

      // Add description words
      if (todo.description) {
        todo.description.toLowerCase().split(' ').forEach(word => {
          if (word.includes(query) && word.length > 2) {
            allTerms.add(todo.description);
          }
        });
      }

      // Add priority
      if (todo.priority.toLowerCase().includes(query)) {
        allTerms.add(`Priority: ${todo.priority}`);
      }
    });

    return Array.from(allTerms).slice(0, 5); // Limit to 5 suggestions
  }, [searchQuery, todos]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Ctrl/Cmd + N - Add new todo
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowCreateForm(true);
      }

      // Escape - Close modals and forms
      if (e.key === 'Escape') {
        if (isModalOpen) {
          handleCloseModal();
        } else if (showCreateForm) {
          setShowCreateForm(false);
        }
      }

      // Ctrl/Cmd + F - Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, showCreateForm]);

  const handleCreateTodo = async (todoData) => {
    try {
      await createTodo(todoData);
      setShowCreateForm(false);
      addNotification('Todo created successfully!', 'success');
    } catch (err) {
      console.error('Failed to create todo:', err);
      addNotification('Failed to create todo. Please try again.', 'error');
    }
  };

  const handleUpdateTodo = async (todoData) => {
    try {
      // Ensure we have a valid ID
      const todoId = currentTodo.id || currentTodo._id;
      if (!todoId) {
        throw new Error('Invalid todo ID');
      }

      await updateTodo(todoId, todoData);
      setIsModalOpen(false);
      setCurrentTodo(null);
      addNotification('Todo updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update todo:', err);
      addNotification('Failed to update todo. Please try again.', 'error');
    }
  };

  const handleDeleteTodo = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(id);
        addNotification('Todo deleted successfully!', 'success');
      } catch (err) {
        console.error('Failed to delete todo:', err);
        addNotification('Failed to delete todo. Please try again.', 'error');
      }
    }
  };

  const handleEditTodo = (todo) => {
    setCurrentTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTodo(null);
  };

  const handleAddTodoClick = () => {
    setShowCreateForm(true);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Apply client-side search
  const searchedTodos = todos.filter(todo => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      todo.title.toLowerCase().includes(query) ||
      (todo.description && todo.description.toLowerCase().includes(query)) ||
      todo.priority.toLowerCase().includes(query)
    );
  });

  // Sort todos based on selected criteria
  const sortedTodos = [...searchedTodos].sort((a, b) => {
    let comparison = 0;

    // Sort by completion status (incomplete first)
    if (a.is_completed !== b.is_completed) {
      return a.is_completed ? 1 : -1;
    }

    switch (sortBy) {
      case 'dueDate':
        // Sort by due date (earlier dates first by default)
        if (a.due_date && b.due_date) {
          comparison = new Date(a.due_date) - new Date(b.due_date);
        } else if (a.due_date && !b.due_date) {
          comparison = -1;
        } else if (!a.due_date && b.due_date) {
          comparison = 1;
        }
        break;

      case 'priority':
        // Sort by priority (high > medium > low)
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;

      case 'createdAt':
        // Sort by creation date (newer first by default)
        comparison = new Date(b.created_at) - new Date(a.created_at);
        break;

      default:
        // Default sort by creation date
        comparison = new Date(b.created_at) - new Date(a.created_at);
    }

    // Apply sort order
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-5 bg-[#f5f3ff] rounded-lg border border-[#e9d8fd] min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pb-4 border-b border-[#e9d8fd]">
        <div className="flex items-center gap-3">
          <h1 className="m-0 text-2xl sm:text-3xl font-bold text-black">Todo List</h1>
          <div className="group relative">
            <button
              className="w-6 h-6 rounded-full bg-[#9e4aff] text-white text-xs flex items-center justify-center cursor-help hover:bg-[#8a36e6] transition-colors"
              aria-label="Keyboard shortcuts"
            >
              ?
            </button>
            <div className="hidden group-hover:block absolute left-0 top-8 bg-white border border-[#e9d8fd] rounded-lg shadow-lg p-3 z-50 min-w-[250px]">
              <p className="font-semibold text-sm mb-2 text-black">Keyboard Shortcuts:</p>
              <ul className="text-xs space-y-1 text-gray-700">
                <li><kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300">Ctrl/⌘ + N</kbd> - New todo</li>
                <li><kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300">Ctrl/⌘ + F</kbd> - Search</li>
                <li><kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300">Esc</kbd> - Close modal/form</li>
              </ul>
            </div>
          </div>
        </div>
        <button onClick={handleAddTodoClick} className="bg-[#9e4aff] text-white border-none py-2 px-4 rounded-md font-medium cursor-pointer transition-all duration-200 hover:bg-[#8a36e6] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(158,74,255,0.15)] w-full sm:w-auto text-sm btn-medium">
          Add Todo
        </button>
      </header>

      <div className={`mb-4 sm:mb-5 p-3 sm:p-4 bg-white rounded-lg border ${searchQuery ? 'border-[#9e4aff]' : 'border-[#e9d8fd]'} relative`}>
        <div className="relative">
          <input
            type="text"
            id="search-input"
            placeholder="Search todos... (Ctrl+F)"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className="w-full p-2 sm:p-3 border border-[#e9d8fd] rounded-lg text-base transition-all duration-200 bg-white text-black box-border focus:outline-none focus:border-[#9e4aff] focus:shadow-[0_0_0_3px_rgba(158,74,255,0.15)] text-sm sm:text-base"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white border border-t-0 border-[#e9d8fd] rounded-b-lg max-h-40 sm:max-h-50 overflow-y-auto z-[100] m-0 p-0 list-none shadow-[0_4px_6px_rgba(158,74,255,0.15)]">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                  className="p-2 sm:p-3 cursor-pointer border-b border-[#f5f3ff] hover:bg-[#ede9fe] text-sm text-black"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={updateFilters}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onSortOrderChange={handleSortOrderChange}
      />

      <ProgressIndicator todos={todos} />

      {showCreateForm && (
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-black mt-0 mb-5">Create New Todo</h2>
          <TodoForm
            onSubmit={handleCreateTodo}
            onCancel={handleCancelCreate}
          />
        </div>
      )}

      {loading && <div className="p-5 text-center rounded-lg mb-5 bg-[#ede9fe] text-black">Loading...</div>}

      {error && <div className="p-5 text-center rounded-lg mb-5 bg-[#fce7f3] text-[#db2777]">{error}</div>}

      {!loading && !error && (
        <div className="todo-list">
          {sortedTodos.length === 0 ? (
            <div className="text-center p-8 sm:p-10 text-[#666666]">
              <p className="text-sm sm:text-base">No todos found. {filters.status !== 'all' || filters.priority || searchQuery ? 'Try changing your filters or search term.' : 'Add a new todo to get started!'}</p>
            </div>
          ) : (
            sortedTodos.map(todo => (
              <TodoItem
                key={todo.id || todo._id}
                todo={todo}
                onToggle={toggleTodoCompletion}
                onDelete={handleDeleteTodo}
                onEdit={handleEditTodo}
              />
            ))
          )}
        </div>
      )}

      {/* Floating Action Button for mobile */}
      <button
        onClick={handleAddTodoClick}
        className="fixed bottom-4 right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#9e4aff] text-white border-none text-xl sm:text-2xl font-bold shadow-[0_4px_8px_rgba(0,0,0,0.2)] cursor-pointer flex items-center justify-center z-[100] transition-all duration-200 hover:bg-[#8a36e6] hover:scale-105 active:scale-95 fab"
        aria-label="Add Todo"
      >
        +
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Edit Todo"
      >
        {currentTodo && (
          <TodoForm
            initialData={currentTodo}
            onSubmit={handleUpdateTodo}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default TodoList;
