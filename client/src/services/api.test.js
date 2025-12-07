import { describe, it, expect, beforeEach } from 'vitest';
import TodoAPI from './api';
import { mockTodos } from './mockData';

describe('TodoAPI', () => {
  beforeEach(() => {
    // Reset mock data before each test
    // We'll need to reinitialize the mock data here if needed
  });

  it('should fetch all todos', async () => {
    const todos = await TodoAPI.getAllTodos();
    expect(todos).toHaveLength(mockTodos.length);
  });

  it('should fetch todos with status filter', async () => {
    const pendingTodos = await TodoAPI.getAllTodos({ status: 'pending' });
    const completedTodos = await TodoAPI.getAllTodos({ status: 'completed' });
    
    expect(pendingTodos.every(todo => !todo.is_completed)).toBe(true);
    expect(completedTodos.every(todo => todo.is_completed)).toBe(true);
  });

  it('should fetch todos with priority filter', async () => {
    const highPriorityTodos = await TodoAPI.getAllTodos({ priority: 'high' });
    expect(highPriorityTodos.every(todo => todo.priority === 'high')).toBe(true);
  });

  it('should create a new todo', async () => {
    const newTodoData = {
      title: 'Test Todo',
      description: 'Test Description',
      priority: 'medium'
    };
    
    const newTodo = await TodoAPI.createTodo(newTodoData);
    expect(newTodo.title).toBe(newTodoData.title);
    expect(newTodo.description).toBe(newTodoData.description);
    expect(newTodo.priority).toBe(newTodoData.priority);
    expect(newTodo.is_completed).toBe(false);
  });

  it('should update a todo', async () => {
    const todoToUpdate = mockTodos[0];
    const updateData = {
      title: 'Updated Title',
      is_completed: true
    };
    
    const updatedTodo = await TodoAPI.updateTodo(todoToUpdate.id, updateData);
    expect(updatedTodo.title).toBe(updateData.title);
    expect(updatedTodo.is_completed).toBe(updateData.is_completed);
  });

  it('should delete a todo', async () => {
    const todoToDelete = mockTodos[0];
    const initialLength = mockTodos.length;
    
    await TodoAPI.deleteTodo(todoToDelete.id);
    expect(mockTodos).toHaveLength(initialLength - 1);
    expect(mockTodos.find(todo => todo.id === todoToDelete.id)).toBeUndefined();
  });

  it('should toggle todo completion status', async () => {
    const todoToToggle = mockTodos[0];
    const initialStatus = todoToToggle.is_completed;
    
    const toggledTodo = await TodoAPI.toggleTodoCompletion(todoToToggle.id);
    expect(toggledTodo.is_completed).toBe(!initialStatus);
  });
});