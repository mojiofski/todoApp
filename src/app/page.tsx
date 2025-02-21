"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Container from "./components/Container";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // برای نشان دادن صفحه لودینگ
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log("error in get session", error.message);
        setLoading(false);
        return;
      }
      setUser(data.session?.user ?? null);
      setLoading(false); // بعد از دریافت اطلاعات، لودینگ را تمام کن
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false); // وقتی وضعیت تغییر کرد، لودینگ را تمام کن
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // فقط وقتی که کاربر موجود است، ریدایرکت انجام بده
    if (user) {
      router.push("./todo");
    }
  }, [user, router]); // این effect وقتی که `user` تغییر کرد اجرا می‌شود

  // اگر در حال لودینگ هستیم، یک صفحه لودینگ نمایش دهیم
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const goToLoginPage = () => {
    router.push("./login");
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center p-4 gap-4">
      <h1 className="text-gray-600 font-semibold text-2xl">
        Welcome to your{" "}
        <span className="text-red-500 font-semibold">Todo App :)</span>
      </h1>
      <Container>
        <div className="flex flex-col gap-4 justify-center items-center">
          <h1 className="text-lg font-semibold text-foreground">
            Please Sign in to use this app feature
          </h1>
          <button
            onClick={goToLoginPage}
            className="text-white bg-red-500 rounded-lg px-10 py-2"
          >
            Sign in
          </button>
        </div>
      </Container>
    </div>
  );
};

export default Home;
