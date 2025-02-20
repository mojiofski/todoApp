"use client";

import React, { useState } from "react";
import { useTodoContext } from "@/context/TodoListContext";
import { supabase } from "@/lib/supabase";

const categories = ["Work", "Personal", "Shopping", "Exercise"];

const AddTodo = () => {
  const [todoInput, setTodoInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-10 py-4 border-b-2 border-b-red-200 rounded-md">
        <h1 className="w-full flex text-gray-700 font-semibold text-2xl">
          <span className="text-red-500 text-2xl font-semibold">
            Todo App :)
          </span>
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex justify-center w-full bg-gray-700 text-white rounded-md px-2 py-1 max-w-[100px] mx-auto"
        >
          Add Task
        </button>
      </div>

      {/* Modal Add Todo */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-6">
          <div className="bg-white p-6 rounded shadow-lg">
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 items-center justify-center px-4 py-4"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-2 ">
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
                </div>

                <div className="flex w-full items-center justify-end gap-2">
                  <button
                    type="submit"
                    disabled={!todoInput.trim()}
                    className={`text-white px-4 py-2 rounded ${
                      todoInput.trim()
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-400 cursor-not-allowed"
                    } transition`}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTodo;
