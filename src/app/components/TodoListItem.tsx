"use client";

import { ITodo, useTodoContext } from "@/context/TodoListContext";
import { useState, useRef, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

const TodoListItem = () => {
  const [editingTodo, setEditingTodo] = useState<ITodo | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const todoContext = useTodoContext();
  const { todos, dispatch } = todoContext || { todos: [], dispatch: () => {} };

  useEffect(() => {
    if (!todoContext) return;

    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      dispatch({ type: "LOAD_TODOS", payload: JSON.parse(savedTodos) });
    }
  }, []);

  useEffect(() => {
    if (!todoContext) return;

    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos, todoContext]);

  // فوکوس روی اینپوت هنگام باز شدن مدال
  useEffect(() => {
    if (editingTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTodo]);

  const handleToggleTodo = (id: string) => {
    dispatch({ type: "TOGGLE_TODO", payload: id });
  };

  const handleRemoveTodo = (id: string) => {
    dispatch({ type: "REMOVE_TODO", payload: id });
  };

  const handleEditTodoOpen = (todo: ITodo) => {
    setEditingTodo(todo);
  };

  const handleEditClose = () => {
    setEditingTodo(null);
  };

  const handleSave = () => {
    const newTitle = inputRef.current?.value.trim() ?? "";
    if (editingTodo && newTitle !== "") {
      dispatch({
        type: "EDIT_TODO",
        payload: { id: editingTodo.id, title: newTitle },
      });
      handleEditClose();
    }
  };

  return (
    <>
      <ul className="space-y-3 mt-6 ">
        {todos.map((todo: ITodo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center p-3 border rounded-md bg-white "
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.complete}
                onChange={() => handleToggleTodo(todo.id)}
                className="cursor-pointer"
              />
              <p
                className={`${
                  todo.complete ? "line-through text-gray-500" : ""
                }`}
              >
                {todo.title}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditTodoOpen(todo)}
                className="px-3 py-2 bg-white text-yellow-500 border rounded-md hover:bg-yellow-500 hover:text-white transition"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleRemoveTodo(todo.id)}
                className="px-3 py-2 bg-white text-red-500 border rounded-md hover:bg-red-500 hover:text-white transition"
              >
                <FaTrashAlt />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for editing form */}
      {editingTodo && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-medium mb-4 text-purple-600">
              Edit Todo
            </h2>
            <input
              type="text"
              ref={inputRef}
              defaultValue={editingTodo.title ?? ""}
              className="border border-gray-300 rounded px-2 py-1 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleEditClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoListItem;
