const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Backend is awake!");
});
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch((err) => console.log('MongoDB connection error:', err));
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});
const Todo = mongoose.model('Todo', todoSchema);
app.post('/todos', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new Todo({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.put('/todos/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!updatedTodo) return res.status(404).json({ message: 'Todo not found' });
    res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));
