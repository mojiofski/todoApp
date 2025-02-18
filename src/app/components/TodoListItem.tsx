"use client";

import { ITodo, useTodoContext } from "@/context/TodoListContext";
import { supabase } from "@/lib/supabase";
import { useState, useRef, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

const TodoListItem = () => {
  const [editingTodo, setEditingTodo] = useState<ITodo | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const todoContext = useTodoContext();
  const { todos, dispatch } = todoContext || { todos: [], dispatch: () => {} };

  useEffect(() => {
    const fetchTodo = async () => {
      const { data: userSession } = await supabase.auth.getSession();
      if (!userSession.session?.user) return;

      const userId = userSession.session.user.id;
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_Id", userId);
      if (error) {
        console.error("Error fetching todos from supabase", error.message);
        return;
      }
      if (data) {
        dispatch({ type: "LOAD_TODOS", payload: data });
      }
    };
    fetchTodo();
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Focus edit input on modal opening
  useEffect(() => {
    if (editingTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTodo]);

  const handleToggleTodo = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ complete: !currentStatus })
      .eq("id", id);
    if (error) {
      console.error("Error updating todo status", error.message);
      return;
    }

    dispatch({ type: "TOGGLE_TODO", payload: id });
  };

  const handleRemoveTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      console.error("Error deleting todos", error.message);
      return;
    }
    dispatch({ type: "REMOVE_TODO", payload: id });

    localStorage.setItem(
      "todos",
      JSON.stringify(todos.filter((todo) => todo.id !== id))
    );
  };

  const handleEditTodoOpen = (todo: ITodo) => {
    setEditingTodo(todo);
  };

  const handleEditClose = () => {
    setEditingTodo(null);
  };

  const handleSave = async () => {
    const newTitle = inputRef.current?.value.trim() ?? "";

    if (editingTodo && newTitle !== "") {
      const { error } = await supabase
        .from("todos")
        .update({ title: newTitle })
        .eq("id", editingTodo.id);

      if (error) {
        console.error("Error updating todo", error.message);
        return;
      }

      dispatch({
        type: "EDIT_TODO",
        payload: { id: editingTodo.id, title: newTitle },
      });

      const updatedTodos = todos.map((todo) =>
        todo.id === editingTodo.id ? { ...todo, title: newTitle } : todo
      );
      localStorage.setItem("todos", JSON.stringify(updatedTodos));

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
                onChange={() => handleToggleTodo(todo.id, todo.complete)}
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
