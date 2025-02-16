import React from "react";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import Container from "./components/Container";
import TodoProvider from "@/context/TodoListContext";

const Home = () => {
  return (
    <div className="border bg-gray-50 h-screen flex flx-col p-4 items-center justify-center">
      <div className="flex flex-col w-full h-screen mt-4 gap-2">
        <h1 className="w-full flex justify-center items-center text-gray-700 font-bold text-2xl mb-2">
         Mojiofski Todo App :)
        </h1>

        <TodoProvider>
          <Container>
            <div>
              <AddTodo />
            </div>
            <div>
              <TodoList />
            </div>
          </Container>
        </TodoProvider>
      </div>
    </div>
  );
};

export default Home;
