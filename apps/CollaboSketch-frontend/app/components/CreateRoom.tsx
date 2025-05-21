"use client";

import { useState } from "react";

interface CreateRoomProps {
  onRoomCreated: (room: { slug: string; id: string }) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function CreateRoom({ onRoomCreated }: CreateRoomProps) {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!roomName.trim()) {
      alert("Room name cannot be empty");
      return;
    }

    if (roomName.trim().length < 3) {
      alert("Room name must be at least 3 characters");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized. Please sign in again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ name: roomName }),
      });

      const data = await response.json();

      if (response.ok) {
        onRoomCreated({ id: data.roomId, slug: data.slug });
        setRoomName("");
      } else {
        alert(data.message || "Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-xl bg-white/40 border border-purple-100 backdrop-blur-xl p-10 rounded-3xl shadow-[0_12px_40px_rgba(124,58,237,0.15)] transition-all hover:shadow-[0_16px_48px_rgba(124,58,237,0.2)]">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Create a New Room🎨
      </h2>

      <div className="flex flex-col sm:flex-row gap-5 items-center">
        <input
          type="text"
          className="flex-grow bg-white/80 border border-gray-300 rounded-2xl px-6 py-4 text-lg placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-300 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-inner mx-auto sm:mx-0"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          disabled={loading}
          aria-label="Room name"
        />

        <button
          className={`px-7 py-4 rounded-2xl font-semibold text-white text-lg transition-all shadow-lg ${
            loading
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600"
          }`}
          onClick={handleCreate}
          disabled={loading}
          aria-label="Create room"
        >
          {loading ? "Creating..." : "Create Room"}
        </button>
      </div>
    </section>
  );
}
