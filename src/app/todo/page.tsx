"use client";

import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import AddTodo from "../components/AddTodo";
import TodoList from "../components/TodoList";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { IoMdLogOut } from "react-icons/io";
import Link from "next/link";

const Todo = () => {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log("error in get session", error.message);
        return;
      }
      setEmail(data.session?.user.email ?? null);
    };
    fetchUser();
  }, []);

  const handlegotoLoginPage = () => {
    router.push("/login");
  };

  return (
    <div className="border h-screen flex flex-col items-center justify-center gap-10">
      {email ? (
        <div className="flex w-full bg-gray-500 p-4 items-center justify-between rounded-md sticky top-0 right-0 left-0 z-50">
          <Link href={"/profile"}>
            <p className="font-semibold text-white text-xl">{email}</p>
          </Link>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="text-white bg-red-500 px-2 py-2 rounded-full text-lg"
          >
            <IoMdLogOut />
          </button>
        </div>
      ) : (
        <div className="flex w-full bg-gray-500 p-4 rounded-lg items-center justify-between ">
          <p className="font-semibold text-white text-xl text-center">
            You must login first!
          </p>
          <button
            onClick={handlegotoLoginPage}
            className="text-white bg-red-500 px-4 py-1 rounded-md"
          >
            Login
          </button>
        </div>
      )}
      {email && (
        <div className="flex flex-col w-full h-screen ">
          <Container>
            <div>
              <AddTodo />
            </div>
            <div className="min-h-[300px] max-h-[500px] overflow-y-auto scrollerbar-hide">
              <TodoList />
            </div>
          </Container>
        </div>
      )}
    </div>
  );
};

export default Todo;
