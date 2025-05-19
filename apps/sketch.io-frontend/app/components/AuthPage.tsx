"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [error, setError] = useState("");
  // console.log("BASE_URL", BASE_URL);


  const handleSubmit = async () => {
    const endpoint = isSignin
      ? `${BASE_URL}/signin`
      : `${BASE_URL}/signup`;

    const payload = isSignin
      ? { username: form.username, password: form.password }
      : { name: form.name, username: form.username, password: form.password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();

        if (isSignin) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("name", data.name);
          router.push("/dashboard");
        } else {
          router.push("/signin");
        }
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-purple-400 via-teal-400 to-purple-500 font-sans overflow-hidden relative">
      {/* Animated blurred colorful blobs in background */}
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-teal-300 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      {/* Left branding area */}
      <div className="md:w-1/2 flex flex-col justify-center items-center px-12 py-20 text-center text-white relative z-10">
        <h1 className="text-6xl font-extrabold leading-[1.1] drop-shadow-lg mb-6 tracking-tight">
          {isSignin ? "Welcome Back!" : "Join Us Today"}
        </h1>
        <p className="max-w-lg text-lg font-semibold drop-shadow-md leading-relaxed tracking-wide opacity-90">
          {isSignin
            ? "Sign in to your creative hub — access your whiteboards, collaborate in real-time, and bring your ideas to life with ease."
            : "Create your account to start crafting beautiful diagrams and wireframes. Join a community built for creativity and collaboration."}
        </p>
      </div>

      {/* Right form area with glassmorphism */}
      <div className="md:w-1/2 flex justify-center items-center px-8 py-12 relative z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-white/30 backdrop-blur-md rounded-3xl shadow-lg p-12 max-w-md w-full border border-white/30"
        >
          <h2 className="text-3xl font-bold text-purple-900 mb-8 text-center drop-shadow-sm">
            {isSignin ? "Sign In" : "Sign Up"}
          </h2>

          {!isSignin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 mb-6 rounded-xl border border-purple-300
                         focus:outline-none focus:ring-2 focus:ring-purple-500
                         placeholder-purple-600 text-purple-900 bg-white/70 transition"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 mb-6 rounded-xl border border-purple-300
                       focus:outline-none focus:ring-2 focus:ring-purple-500
                       placeholder-purple-600 text-purple-900 bg-white/70 transition"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 mb-6 rounded-xl border border-purple-300
                       focus:outline-none focus:ring-2 focus:ring-purple-500
                       placeholder-purple-600 text-purple-900 bg-white/70 transition"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {error && (
            <div className="mb-6 text-sm text-red-600 text-center font-semibold drop-shadow-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-teal-500
                       hover:from-purple-700 hover:to-teal-600
                       rounded-xl text-white font-semibold text-lg shadow-xl
                       transform transition duration-300 hover:scale-105"
          >
            {isSignin ? "Sign In" : "Sign Up"}
          </button>

          <p className="mt-8 text-center text-purple-900 font-medium drop-shadow-sm select-none">
            {isSignin ? (
              <>
                Don&rsquo;t have an account?{" "}
                <a
                  href="/signup"
                  className="text-purple-700 hover:underline font-semibold cursor-pointer"
                >
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a
                  href="/signin"
                  className="text-purple-700 hover:underline font-semibold cursor-pointer"
                >
                  Sign in
                </a>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
