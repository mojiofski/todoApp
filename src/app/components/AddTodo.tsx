"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTodoContext } from "@/context/TodoListContext";
import { supabase } from "@/lib/supabase";

const categories = [
  "Work",
  "Personal",
  "Shopping",
  "Exercise",
  "Entertainment",
  "Cooking",
  "Learning",
  "Repairs",
  "Travel",
  "Gaming",
  "Sport"
];
const AddTodo = () => {
  const [todoInput, setTodoInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // focus add input on modal open
  useEffect(() => {
    inputRef.current?.focus();
  }, [isModalOpen]);

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
    <div className="w-full p-6 rounded-md">
      <div className="flex items-center justify-between py-2 ">
        <h1 className="w-full flex items-center font-semibold text-2xl ">
          <span className=" text-2xl font-semibold text-foreground">
            Todo App :)
          </span>
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex justify-center w-full bg-blue-500 text-white rounded-md px-2 py-1 max-w-[100px] mx-auto"
        >
          Add Task
        </button>
      </div>

      {/* Modal Add Todo */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center  bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-xs mx-auto md:max-w-lg ">
            <h2 className="text-lg font-medium mb-4 text-blue-500">Add Todo</h2>
            <form onSubmit={handleSubmit} className="">
              <input
                type="text"
                ref={inputRef}
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border px-2 rounded-lg py-1 mb-4"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTodo;
