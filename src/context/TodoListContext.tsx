"use client";

import { createContext, useContext, useReducer } from "react";

export interface ITodo {
  id: string;
  title: string;
  complete: boolean;
  created_at: string;
  category: string;
}
type ActionType =
  | { type: "ADD_TODO"; payload: ITodo }
  | { type: "REMOVE_TODO"; payload: string }
  | { type: "TOGGLE_TODO"; payload: string }
  | {
      type: "EDIT_TODO";
      payload: { id: string; title: string; category: string };
    }
  | { type: "LOAD_TODOS"; payload: ITodo[] };

export interface ITodoContext {
  todos: ITodo[];
  dispatch: React.Dispatch<ActionType>;
}
interface ITodoProvider {
  children: React.ReactNode;
}
const TodoContext = createContext<ITodoContext | undefined>(undefined);

const todoReducer = (state: ITodo[], action: ActionType): ITodo[] => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, action.payload];
    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, complete: !todo.complete }
          : todo
      );
    case "EDIT_TODO":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? {
              ...todo,
              title: action.payload.title,
              category: action.payload.category,
            }
          : todo
      );
    case "LOAD_TODOS":
      return action.payload;

    default:
      return state;
  }
};

function TodoProvider({ children }: ITodoProvider) {
  const [todos, dispatch] = useReducer(todoReducer, []);
  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}
export const useTodoContext = () => {
  return useContext(TodoContext);
};

export default TodoProvider;
