"use client";

import React, { useState } from "react";
import { useTodoContext } from "@/context/TodoListContext";
import { IoMdAdd } from "react-icons/io";
import { supabase } from "@/lib/supabase";

const categories = ["Work", "Personal", "Shopping", "Exercise"];

const AddTodo = () => {
  const [todoInput, setTodoInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const todoContext = useTodoContext();
  if (!todoContext) return null;
  const { dispatch } = todoContext;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!todoInput.trim()) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([
        { title: todoInput, complete: false, category: selectedCategory },
      ])
      .select();

    if (error) {
      console.error("Error in inserting todo!", error.message);
      return;
    }

    if (data && data.length > 0) {
      dispatch({
        type: "ADD_TODO",
        payload: data[0],
      });
    }

    setTodoInput("");
  };

  return (
    <div className="rounded-lg shadow-lg w-full">
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-center justify-center px-4 py-4"
      >
        <input
          type="text"
          name="todoName"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          placeholder="Enter Here..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-3 py-2 rounded-lg bg-white text-gray-700"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
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
