"use client";

import { ITodo, useTodoContext } from "@/context/TodoListContext";
import { supabase } from "@/lib/supabase";
import { useState, useRef, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { FaDumbbell } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import { PiCookingPotFill } from "react-icons/pi";
import { FaBookOpen } from "react-icons/fa";
import { FaHammer } from "react-icons/fa";
import { ImAirplane } from "react-icons/im";
import { IoGameController } from "react-icons/io5";
import { MdSports } from "react-icons/md";
import { FiMusic } from "react-icons/fi";

const categoryIcon = {
  Work: (
    <MdOutlineWorkOutline className="text-blue-500 font-semibold text-xl" />
  ),
  Personal: <IoPersonSharp className="text-red-500 font-semibold text-xl" />,
  Shopping: <FaCartShopping className="text-green-500 font-semibold text-xl" />,
  Exercise: <FaDumbbell className="text-purple-500 font-semibold text-xl" />,
  Entertainment: <MdLiveTv className="text-gray-600 font-semibold text-xl" />,
  Cooking: (
    <PiCookingPotFill className="text-orange-600 font-semibold text-xl" />
  ),
  Learning: <FaBookOpen className="text-slate-500 font-semibold text-xl" />,
  Repairs: <FaHammer className="text-slate-950 font-semibold text-xl" />,
  Travel: <ImAirplane className="text-sky-500 font-semibold text-xl" />,
  Gaming: <IoGameController className="text-pink-500 font-semibold text-xl" />,
  Sport: <MdSports className="text-yellow-800 font-semibold text-xl" />,
  Music: <FiMusic className="text-blue-800 font-semibold text-xl" />,
};

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
  "Sport",
  "Music",
];

const filtredByTimes = ["Last Month", "Last Week", "Yesterday", "Today"];

const TodoListItem = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [editingTodo, setEditingTodo] = useState<ITodo | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [filtredCategories, setFiltredCategories] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [todoDate, setTodoDate] = useState("");

  const todoContext = useTodoContext();
  const { todos, dispatch } = todoContext || { todos: [], dispatch: () => {} };

  // Fetch Todos from database and dispatch to context
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

  // saved todos on clients local storage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Focus edit input on modal opening
  useEffect(() => {
    if (editingTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTodo]);

  // Update Toggle todo in database and dispatch to context
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

  // Remove todo from database and dispatch to context and set new todos in local storage
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

  // Saving updated todo in database and dispatch in context and update amount of todos in loacl storage
  const handleSave = async () => {
    const newTitle = inputRef.current?.value.trim() ?? "";

    if (editingTodo && newTitle !== "") {
      const { error } = await supabase
        .from("todos")
        .update({ title: newTitle, category: selectedCategory })
        .eq("id", editingTodo.id);

      if (error) {
        console.error("Error updating todo", error.message);
        return;
      }

      dispatch({
        type: "EDIT_TODO",
        payload: {
          id: editingTodo.id,
          title: newTitle,
          category: selectedCategory,
        },
      });

      const updatedTodos = todos.map((todo) =>
        todo.id === editingTodo.id ? { ...todo, title: newTitle } : todo
      );
      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      handleEditClose();
    }
  };

  // Filtring todos by time
  const filtredByTime = (todo: ITodo) => {
    const createdAt = new Date(todo.created_at);
    const now = new Date();
    if (timeFilter === "Today") {
      return createdAt.toDateString() === now.toDateString();
    }
    if (timeFilter === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      return createdAt.toDateString() === yesterday.toDateString();
    }
    if (timeFilter === "Last Week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return createdAt >= oneWeekAgo;
    }
    if (timeFilter === "Last Month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      return createdAt >= oneMonthAgo;
    }
    return true;
  };

  // fetching todo from database by searching client
  const handleChangeSearchInput = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = e.target.value.toLowerCase();
    setSearchInput(query);

    const { data: userSession } = await supabase.auth.getSession();
    if (!userSession.session?.user) return;

    const userId = userSession.session.user.id;

    if (!query) {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_Id", userId);
      if (error) {
        console.error("Error fetching all todos:", error.message);
        return;
      }
      dispatch({ type: "LOAD_TODOS", payload: data });
      return;
    }

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_Id", userId)
      .ilike("title", `%${query}%`);

    if (error) {
      console.error("Error searching todos:", error.message);
      return;
    }

    dispatch({ type: "LOAD_TODOS", payload: data });
  };

  return (
    <>
      {/* Filter Todo Section */}
      <div className="flex flex-col gap-4 px-6 py-3 justify-between">
        {/* Category Filter */}
        <div className="flex items-center justify-center gap-2 w-full">
          <p className="font-semibold text-foreground">Filtred By Categories</p>
          <select
            value={filtredCategories}
            onChange={(e) => setFiltredCategories(e.target.value)}
            className="border px-3 py-1 rounded-lg bg-white text-gray-700"
          >
            <option value="All">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {/* Buttons Filter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 justify-center items-center">
          {filtredByTimes.map((item) => (
            <button
              key={item}
              onClick={() => setTimeFilter(item)}
              className={`px-2 py-1 rounded-md text-white transition ${
                timeFilter === item ? "bg-blue-600" : "bg-red-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        {/* Filtred by Date */}
        <div className="flex items-center justify-center gap-2 w-full">
          <p className="text-foreground font-semibold">Filtred by Date</p>
          <input
            type="date"
            value={todoDate}
            onChange={(e) => setTodoDate(e.target.value)}
            className="border px-2 py-1 rounded-lg"
          />
        </div>
        {/* Search Input */}
        <div className="flex w-full items-center gap-2">
          <form className="relative w-2/3">
            <div className="absolute inset-y-0 left-2 flex items-center">
              <FaSearch className="text-gray-500 text-md" aria-label="Search" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={handleChangeSearchInput}
              className="border border-gray-300 rounded px-7 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your task name"
            />
          </form>
          <div className="flex w-1/3">
            <button
              onClick={() => setTodoDate("")}
              className="px-2 py-2 rounded-md text-white transition bg-red-500 w-full"
            >
              All Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Display of todos */}
      <div className="flex-grow">
        <ul className="space-y-3">
          {todos

            .filter(
              (todo) =>
                filtredCategories === "All" ||
                todo.category === filtredCategories
            )
            .filter((todo) => !todoDate || todo.date === todoDate)
            .filter((todo) => filtredByTime(todo))
            .reverse()
            .map((todo: ITodo) => (
              <li
                key={todo.id}
                className="flex justify-between items-center p-3 border rounded-md bg-white "
              >
                <div className="flex items-center gap-2  w-full">
                  <div className="flex flex-col w-full ">
                    <div className="flex items-center justify-center w-max gap-2">
                      <span>
                        {
                          categoryIcon[
                            todo.category as keyof typeof categoryIcon
                          ]
                        }
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(todo.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-1 w-full">
                      <input
                        type="checkbox"
                        checked={todo.complete}
                        onChange={() =>
                          handleToggleTodo(todo.id, todo.complete)
                        }
                        className="cursor-pointer"
                      />
                      <p
                        className={`font-semibold text-md text-gray-900 ${
                          todo.complete ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {todo.title}
                      </p>
                    </div>
                  </div>
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
      </div>

      {/* Modal for editing form */}
      {editingTodo && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-background p-6 rounded shadow-lg w-full max-w-xs mx-auto md:max-w-lg">
            <h2 className="text-lg text-foreground font-medium mb-4">
              Edit Todo
            </h2>
            <input
              type="text"
              ref={inputRef}
              defaultValue={editingTodo.title ?? ""}
              className="border border-gray-300 rounded px-2 py-1 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2 mb-4">
            
              <p className="font-semibold text-foreground">Category</p>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border px-2 rounded-lg py-1"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleEditClose}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
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
