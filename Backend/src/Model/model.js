const mongoose = require("mongoose"); // library import
const authModel = require("./authmodel");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }

});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;