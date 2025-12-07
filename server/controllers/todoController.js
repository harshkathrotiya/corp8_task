// controllers/TodoController.js
const {
  initializeDatabase,
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoCompletion,
} = require("../models/Todo.js");

// Get all todos
async function getTodos(req, res) {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
    };

    const todos = await getAllTodos(filters);
    res.json(todos);
  } catch (err) {
    console.error('Error in getTodos:', err);
    res.status(500).json({ error: "Failed to fetch todos", details: err.message });
  }
}

// Get single todo
async function getTodo(req, res) {
  try {
    const todo = await getTodoById(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    res.json(todo);
  } catch (err) {
    if (err.message === "Invalid todo ID")
      return res.status(400).json({ error: "Invalid todo ID format" });

    res.status(500).json({ error: "Failed to fetch todo" });
  }
}

// Create todo
async function create(req, res) {
  try {
    const { title, description, due_date, priority } = req.body;

    if (!title) return res.status(400).json({ error: "Title is required" });

    const newTodo = await createTodo({
      title,
      description: description || "",
      due_date: due_date || null,
      priority: priority || "medium",
    });

    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
}

// Update todo
async function update(req, res) {
  try {
    const updatedTodo = await updateTodo(req.params.id, req.body);
    res.json(updatedTodo);
  } catch (err) {
    if (err.message === "Todo not found")
      return res.status(404).json({ error: "Todo not found" });

    if (err.message === "Invalid todo ID")
      return res.status(400).json({ error: "Invalid todo ID format" });

    res.status(500).json({ error: "Failed to update todo" });
  }
}

// Delete todo
async function remove(req, res) {
  try {
    await deleteTodo(req.params.id);
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    if (err.message === "Todo not found")
      return res.status(404).json({ error: "Todo not found" });

    if (err.message === "Invalid todo ID")
      return res.status(400).json({ error: "Invalid todo ID format" });

    res.status(500).json({ error: "Failed to delete todo" });
  }
}

// Toggle completion
async function toggleCompletion(req, res) {
  try {
    const updatedTodo = await toggleTodoCompletion(req.params.id);
    res.json(updatedTodo);
  } catch (err) {
    if (err.message === "Todo not found")
      return res.status(404).json({ error: "Todo not found" });

    if (err.message === "Invalid todo ID")
      return res.status(400).json({ error: "Invalid todo ID format" });

    res.status(500).json({ error: "Failed to toggle completion" });
  }
}

module.exports = {
  initializeDatabase,
  getTodos,
  getTodo,
  create,
  update,
  remove,
  toggleCompletion,
};
