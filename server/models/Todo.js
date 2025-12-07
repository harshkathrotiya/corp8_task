const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/todoapp";
const client = new MongoClient(uri);

// Extract database name from URI or use default
const dbName = uri.includes('mongodb+srv://') || uri.includes('mongodb://')
  ? (uri.split('/').pop().split('?')[0] || 'todoapp')
  : 'todoapp';

let db, todosCollection;

// Connect to DB
async function connectToDatabase() {
  if (!db) {
    try {
      console.log('🔌 Connecting to MongoDB...');
      console.log('📍 MongoDB URI exists:', !!process.env.MONGODB_URI);
      console.log('📦 Database name:', dbName);

      await client.connect();
      console.log('✅ MongoDB client connected');

      db = client.db(dbName);
      todosCollection = db.collection("todos");

      console.log('✅ MongoDB connected successfully to database:', dbName);
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      console.error('❌ Error stack:', error.stack);
      throw error;
    }
  }
  return todosCollection;
}

// Initialize DB with sample data (optional)
async function initializeDatabase() {
  const todosCollection = await connectToDatabase();
  const count = await todosCollection.countDocuments();

  if (count === 0) {
    const sampleTodos = [
      {
        title: "Buy groceries",
        description: "Milk, eggs, bread",
        due_date: new Date("2025-12-31T18:30:00Z"),
        priority: "medium",
        is_completed: false,
        created_at: new Date("2025-12-01T10:00:00Z"),
        updated_at: new Date("2025-12-01T10:00:00Z"),
      },
      {
        title: "Finish project proposal",
        description: "Complete the client proposal document",
        due_date: new Date("2025-12-15T10:00:00Z"),
        priority: "high",
        is_completed: false,
        created_at: new Date("2025-12-02T09:30:00Z"),
        updated_at: new Date("2025-12-02T09:30:00Z"),
      },
      {
        title: "Schedule team meeting",
        description: "Plan quarterly review meeting",
        due_date: new Date("2025-12-10T14:00:00Z"),
        priority: "low",
        is_completed: true,
        created_at: new Date("2025-12-01T11:00:00Z"),
        updated_at: new Date("2025-12-03T16:00:00Z"),
      },
      {
        title: "Research new technologies",
        description: "Look into new frontend frameworks",
        due_date: new Date("2025-12-20T12:00:00Z"),
        priority: "medium",
        is_completed: false,
        created_at: new Date("2025-12-03T14:00:00Z"),
        updated_at: new Date("2025-12-03T14:00:00Z"),
      },
      {
        title: "Update documentation",
        description: "Review and update project documentation",
        due_date: new Date("2025-12-25T17:00:00Z"),
        priority: "high",
        is_completed: false,
        created_at: new Date("2025-12-04T10:00:00Z"),
        updated_at: new Date("2025-12-04T10:00:00Z"),
      }
    ];

    await todosCollection.insertMany(sampleTodos);
  }
}

// Convert MongoDB document to API response format
function convertTodoDocument(doc) {
  if (!doc) return null;

  // Convert _id to id for frontend compatibility
  const { _id, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest
  };
}

// ────────────────────────────
//          CRUD METHODS
// ────────────────────────────

// Get all todos
async function getAllTodos(filters = {}) {
  const todosCollection = await connectToDatabase();
  const query = {};

  if (filters.status === "completed") query.is_completed = true;
  else if (filters.status === "pending") query.is_completed = false;

  if (filters.priority) query.priority = filters.priority;

  const todos = await todosCollection.find(query).toArray();
  // Convert all documents to API response format
  return todos.map(convertTodoDocument);
}

// Get a single todo
async function getTodoById(id) {
  const todosCollection = await connectToDatabase();
  if (!ObjectId.isValid(id)) throw new Error("Invalid todo ID");

  const todo = await todosCollection.findOne({ _id: new ObjectId(id) });
  // Convert document to API response format
  return convertTodoDocument(todo);
}

// Create new todo
async function createTodo(data) {
  const todosCollection = await connectToDatabase();

  const newTodo = {
    ...data,
    is_completed: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const result = await todosCollection.insertOne(newTodo);
  // Return the created todo in API response format
  const createdTodo = await todosCollection.findOne({ _id: result.insertedId });
  return convertTodoDocument(createdTodo);
}

// Update todo
async function updateTodo(id, data) {
  const todosCollection = await connectToDatabase();
  if (!ObjectId.isValid(id)) throw new Error("Invalid todo ID");

  data.updated_at = new Date();

  const result = await todosCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );

  if (result.matchedCount === 0) throw new Error("Todo not found");

  const updatedTodo = await todosCollection.findOne({ _id: new ObjectId(id) });
  // Convert document to API response format
  return convertTodoDocument(updatedTodo);
}

// Delete todo
async function deleteTodo(id) {
  const todosCollection = await connectToDatabase();
  if (!ObjectId.isValid(id)) throw new Error("Invalid todo ID");

  const result = await todosCollection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) throw new Error("Todo not found");

  return { message: "Todo deleted" };
}

// Toggle completion
async function toggleTodoCompletion(id) {
  const todosCollection = await connectToDatabase();
  if (!ObjectId.isValid(id)) throw new Error("Invalid todo ID");

  const todo = await todosCollection.findOne({ _id: new ObjectId(id) });
  if (!todo) throw new Error("Todo not found");

  const updatedStatus = !todo.is_completed;

  await todosCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { is_completed: updatedStatus, updated_at: new Date() } }
  );

  const updatedTodo = await todosCollection.findOne({ _id: new ObjectId(id) });
  // Convert document to API response format
  return convertTodoDocument(updatedTodo);
}

module.exports = {
  initializeDatabase,
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoCompletion,
};