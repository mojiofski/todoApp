import React from "react";
import TodoListItem from "./TodoListItem";

const TodoList = () => {
  return (
    <div className="mt-6 overflow-y-auto flex-grow">
      <TodoListItem />
    </div>
  );
};

export default TodoList;
