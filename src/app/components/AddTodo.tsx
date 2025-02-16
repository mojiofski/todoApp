"use client";

import React, { useState } from "react";
import { useTodoContext } from "@/context/TodoListContext";
import { v4 as uuidv4 } from "uuid";
import { IoMdAdd } from "react-icons/io";
const AddTodo = () => {
  const [todoInput, setTodoInput] = useState("");
  const todoContext = useTodoContext();
  if (!todoContext) return null;
  const { dispatch } = todoContext;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todoInput.trim()) {
      dispatch({
        type: "ADD_TODO",
        payload: { id: uuidv4(), title: todoInput, complete: false },
      });
      setTodoInput("");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-center justify-center bg-gray-300 px-6 py-4 rounded-lg shadow-md w-full  "
      >
        <input
          type="text"
          name="todoName"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          placeholder="Enter Here..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!todoInput.trim()}
          className={`px-4 py-3 rounded-lg text-white font-semibold ${
            todoInput.trim()
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          } transition`}
        >
          <IoMdAdd />
        </button>
      </form>
    </div>
  );
};

export default AddTodo;
