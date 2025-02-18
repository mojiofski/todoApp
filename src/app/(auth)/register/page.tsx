"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("User Registered:", data?.user); // حالا از data.user استفاده کنید
      router.push("/confirm-email");
    }
  };

  return (
    <div className="flex w-full max-w-md mx-auto h-[100vh] items-center ">
      <div className="flex flex-col bg-white w-full p-4 rounded-lg shadow-lg ">
        <h1 className="text-xl text-center">
          Register to{" "}
          <span className="text-red-500 font-semibold">Todo App :)</span>
        </h1>
        <form
          onSubmit={handleRegister}
          className="flex flex-col p-4 w-full gap-4"
        >
          <input
            className="px-2 py-2  border-gray-300 bg-white rounded-md ring-2 ring-gray-200"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="px-2 py-2  border-gray-300 bg-white rounded-md ring-2 ring-gray-200"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="text-white bg-red-500 px-10 py-1 rounded-md"
            type="submit"
          >
            Register
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <div className="mt-2 text-gray-600 text-center">
          <p>
            <span>{`Are you haven't an account? `}</span>
            <span className="text-black font-semibold">
              <Link href={"/login"} className="text-blue-500 underline">
                Sign in now!
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
