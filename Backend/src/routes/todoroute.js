const express = require("express");
const router = express.Router();
const Todo = require("../Model/model");
const authMiddleware = require("../middlewares/authmiddleware");

// GET all todos
router.get("/todos",authMiddleware, async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }); // only fetch todos for the authenticated user
  res.json(todos);
});

// POST new todo
router.post("/todos", authMiddleware, async (req, res) => {
   console.log("BODY:", req.body);     // 🔍 check title
    console.log("USER:", req.user);   
  const newTodo = await Todo.create({
    title: req.body.title,
    user: req.user.id // associate todo with authenticated user
  });
  res.json(newTodo);
});

// DELETE todo
router.delete("/todos/:id", authMiddleware, async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

router.put("/todos/:id/toggle", authMiddleware, async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  // toggle
  todo.completed = !todo.completed;

  await todo.save();

  res.json(todo);
});

router.put("/todos/:id",authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title: title },  // update title 
      { returnDocument: 'after' }    );
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;