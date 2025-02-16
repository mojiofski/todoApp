"use client";

import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import AddTodo from "../components/AddTodo";
import TodoList from "../components/TodoList";

const Todo = () => {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setName(storedName);
    }
  }, []);
  return (
    <div className="border bg-gray-50 h-screen flex flex-col p-4 items-center justify-center">
      <div className="flex flex-col w-full h-screen mt-4 gap-2">
        <h1 className="w-full flex justify-center items-center text-gray-700 font-semibold text-2xl mb-2 gap-2">
          <span className="text-red-500 font-semibold">
            {name ? name?.charAt(0).toUpperCase() + name?.slice(1) : ""}
          </span>
          <span>Todo App :)</span>
        </h1>
        <Container>
          <div>
            <AddTodo />
          </div>
          <div>
            <TodoList />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Todo;
