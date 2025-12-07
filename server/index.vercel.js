const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');
const {
  initializeDatabase,
  getTodos,
  getTodo,
  create,
  update,
  remove,
  toggleCompletion
} = require('./controllers/todoController');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the client build folder in production
app.use(express.static(path.join(__dirname, 'client-dist')));

// Initialize database on first request (lazy initialization for serverless)
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }
  next();
});

// Routes

// GET /todos - List all todos with optional filtering
app.get('/api/todos', getTodos);

// GET /todos/:id - Get a single todo
app.get('/api/todos/:id', (req, res) => {
  // Validate ObjectId format
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid todo ID format' });
  }
  getTodo(req, res);
});

// POST /todos - Create a new todo
app.post('/api/todos', create);

// PUT /todos/:id - Update a todo
app.put('/api/todos/:id', (req, res) => {
  // Validate ObjectId format
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid todo ID format' });
  }
  update(req, res);
});

// DELETE /todos/:id - Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  // Validate ObjectId format
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid todo ID format' });
  }
  remove(req, res);
});

// PUT /todos/:id/toggle - Toggle todo completion status
app.put('/api/todos/:id/toggle', (req, res) => {
  // Validate ObjectId format
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid todo ID format' });
  }
  toggleCompletion(req, res);
});

// Serve the client app for all other routes (SPA fallback)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'client-dist', 'index.html'));
});

module.exports = app;