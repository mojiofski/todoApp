"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Container from "./components/Container";

const Home = () => {
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setError("please enter your name");
      return;
    }

    setError("");
    localStorage.setItem("username", nameInput);

    router.push("./todo");
  };

  return (
    <div className="flex flex-col w-full h-screen bg-white items-center justify-center p-4">
      <h1 className="text-gray-600 font-semibold text-lg">
        Welcome to your{" "}
        <span className="text-red-500 font-semibold">Todo App :)</span>
      </h1>
      <Container>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full bg-white items-center justify-center gap-2 p-4"
        >
          <legend className="text-center text-gray-600">
            please enter your name
            <input
              className="w-full border-2 rounded-md px-4 py-2 text-center text-gray-800"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </legend>

          <button className="bg-red-500 px-12 py-2 rounded-lg text-white">
            Lets go
          </button>
          {error && <p className="text-red-500 ">{error}</p>}
        </form>
      </Container>
    </div>
  );
};

export default Home;
