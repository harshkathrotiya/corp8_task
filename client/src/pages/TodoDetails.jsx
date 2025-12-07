import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import TodoAPI from '../services/api';

const TodoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setLoading(true);
        const data = await TodoAPI.getTodoById(id);
        setTodo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  const handleBack = () => {
    navigate('/');
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  if (loading) return <div className="loading">Loading todo details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!todo) return <div className="error-message">Todo not found</div>;

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-5 bg-[#f5f3ff] rounded-lg border border-[#e9d8fd] min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pb-4 border-b border-[#e9d8fd]">
        <h1 className="m-0 text-2xl sm:text-3xl font-bold text-black">Todo Details</h1>
        <button onClick={handleBack} className="bg-[#9e4aff] text-white border-none py-2 px-4 rounded-md font-medium cursor-pointer transition-all duration-200 hover:bg-[#8a36e6] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(158,74,255,0.15)] w-full sm:w-auto text-sm btn-medium">
          Back to List
        </button>
      </header>

      <div className="bg-white rounded-lg border border-[#e9d8fd] p-6">
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-[#e9d8fd]">
          <h2 className={`text-2xl m-0 ${todo.is_completed ? 'line-through text-gray-500' : 'text-black'}`}>
            {todo.title}
          </h2>
          <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${todo.priority === 'high' ? 'bg-red-100 text-red-800' :
              todo.priority === 'medium' ? 'bg-purple-100 text-purple-800' :
                'bg-violet-100 text-violet-800'
            }`}>
            {todo.priority}
          </span>
        </div>

        {todo.description && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Description</h3>
            <p className="text-black">{todo.description}</p>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Status</h3>
          <p className="text-black">{todo.is_completed ? 'Completed' : 'Pending'}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Due Date</h3>
          <p className="text-black">{todo.due_date ? format(new Date(todo.due_date), 'MMMM dd, yyyy hh:mm a') : 'No due date'}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Created</h3>
          <p className="text-black">{format(new Date(todo.created_at), 'MMMM dd, yyyy hh:mm a')}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Last Updated</h3>
          <p className="text-black">{format(new Date(todo.updated_at), 'MMMM dd, yyyy hh:mm a')}</p>
        </div>
      </div>
    </div>
  );
};

export default TodoDetails;