import { useState, useEffect } from 'react';
import TodoAPI from '../services/api';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: ''
  });

  // Normalize todo data to ensure consistent id field
  const normalizeTodo = (todo) => {
    // If todo has _id (from MongoDB) but no id, use _id as id
    if (todo._id && !todo.id) {
      return { ...todo, id: todo._id };
    }
    return todo;
  };

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await TodoAPI.getAllTodos(filters);
      // Normalize all todos to ensure consistent id field
      const normalizedData = data.map(normalizeTodo);
      setTodos(normalizedData);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError(err.message || 'Failed to fetch todos. Please check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todoData) => {
    setLoading(true);
    setError(null);
    try {
      const newTodo = await TodoAPI.createTodo(todoData);
      // Normalize the new todo
      const normalizedTodo = normalizeTodo(newTodo);
      setTodos(prev => [...prev, normalizedTodo]);
      return normalizedTodo;
    } catch (err) {
      console.error('Error creating todo:', err);
      setError(err.message || 'Failed to create todo. Please check your network connection and try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id, todoData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTodo = await TodoAPI.updateTodo(id, todoData);
      // Normalize the updated todo
      const normalizedTodo = normalizeTodo(updatedTodo);
      setTodos(prev => prev.map(todo => todo.id === id ? normalizedTodo : todo));
      return normalizedTodo;
    } catch (err) {
      console.error('Error updating todo:', err);
      setError(err.message || 'Failed to update todo. Please check your network connection and try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await TodoAPI.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError(err.message || 'Failed to delete todo. Please check your network connection and try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleTodoCompletion = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTodo = await TodoAPI.toggleTodoCompletion(id);
      // Normalize the updated todo
      const normalizedTodo = normalizeTodo(updatedTodo);
      setTodos(prev => prev.map(todo => todo.id === id ? normalizedTodo : todo));
    } catch (err) {
      console.error('Error toggling todo completion:', err);
      setError(err.message || 'Failed to update todo status. Please check your network connection and try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    fetchTodos();
  }, [filters]);

  return {
    todos,
    loading,
    error,
    filters,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompletion,
    updateFilters
  };
};