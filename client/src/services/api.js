const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  // Check if response is JSON
  if (contentType && contentType.includes('application/json')) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Request failed');
    }
    return response.json();
  } else {
    // If not JSON, it's likely HTML (an error page or the app itself)
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    // If response is OK but not JSON, it's unexpected
    throw new Error('Unexpected response format from server');
  }
};

class TodoAPI {
  static async getAllTodos(filters = {}) {
    const queryParams = new URLSearchParams();
    
    // Add filters as query parameters
    if (filters.status && filters.status !== 'all') {
      queryParams.append('status', filters.status);
    }
    if (filters.priority) {
      queryParams.append('priority', filters.priority);
    }
    
    const response = await fetch(`${API_BASE_URL}/todos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
    return handleResponse(response);
  }
  
  static async getTodoById(id) {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`);
    return handleResponse(response);
  }
  
  static async createTodo(todoData) {
    // Validate required fields
    if (!todoData.title) {
      throw new Error('Title is required');
    }
    
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });
    
    return handleResponse(response);
  }
  
  static async updateTodo(id, todoData) {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });
    
    return handleResponse(response);
  }
  
  static async deleteTodo(id) {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    
    return handleResponse(response);
  }
  
  static async toggleTodoCompletion(id) {
    const response = await fetch(`${API_BASE_URL}/todos/${id}/toggle`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse(response);
  }
}

export default TodoAPI;