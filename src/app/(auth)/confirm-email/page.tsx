"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // اگر در پروژه‌تان supabase را تنظیم کرده‌اید

const ConfirmEmail = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = () => {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            // اگر کاربر لاگین شد، به صفحه‌ی Todo هدایت می‌شود
            router.push("/todo");
          }
        }
      );

      // انجام cleanup
      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    checkUserStatus();
  }, [router]);

  return (
    <div className="flex w-full max-w-md mx-auto h-[100vh] items-center ">
      <div className="flex flex-col bg-white w-full p-4 rounded-lg shadow-lg ">
        <h1 className="text-xl text-center text-gray-600">
          Please check your email and tap on the confirm your account link{" "}
          <span className="text-red-500 font-semibold">:)</span>
        </h1>
      </div>
    </div>
  );
};

export default ConfirmEmail;
