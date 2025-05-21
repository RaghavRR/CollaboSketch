"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Header } from "../components/Header";
import { CreateRoom } from "../components/CreateRoom";
import { RoomList } from "../components/RoomList";
import Footer  from "../components/Footer";

interface Room {
  id: string;
  slug: string;
  name?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Dashboard() {
  const router = useRouter();

  const [name, setName] = useState("User");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [joinRoomId, setJoinRoomId] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/signin");
      return;
    }

    if (storedName) setName(storedName);

    fetchRooms(storedToken);
  }, [router]);

  const fetchRooms = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/my-rooms`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data = await response.json();
      setRooms(
        (data.rooms || []).map((room: any) => ({
          id: room.id,
          slug: room.slug || `my-room-${room.id.toString().slice(0, 6)}`,
        }))
      );


    } catch (error){
      console.error(error);
    }
  };

  const handleRoomCreated = (room: { id: string; slug: string }) => {
    setRooms((prevRooms) => [...prevRooms, { id: room.id, slug: room.slug }]);
  };



  const handleLogout = () => {
    localStorage.clear();
    router.push("/signin");
  };

  const handleJoinRoomById = async () => {
    const roomId = joinRoomId.trim();
    const token = localStorage.getItem("token");

    if (!roomId) {
      alert("Please enter a Room ID.");
      return;
    }

    if (!token) {
      alert("You must be logged in to join a room.");
      router.push("/signin");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/room-by-id/${roomId}`, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Room not found");
        return;
      }

      router.push(`/canvas/${roomId}`);
    } catch (error){
      console.error("Error while joining room:", error);
      alert("Failed to join room. Please try again later.");
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to delete a room.");
      router.push("/signin");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/room/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Failed to delete room");
        return;
      }

      setRooms((prev) => prev.filter((room) => room.id !== roomId));
    } catch {
      alert("Error deleting room");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 text-gray-900 flex flex-col">
      {/* Header */}
      <Header name={name} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Side-by-side container */}
          <div className="flex flex-col lg:flex-row gap-10 justify-center items-center w-full max-w-7xl mx-auto">
            {/* Create Room */}
            <CreateRoom onRoomCreated={handleRoomCreated} />

            {/* Join Room */}
            <section className="w-full max-w-xl bg-white/40 border border-purple-100 backdrop-blur-xl p-10 rounded-3xl shadow-[0_12px_40px_rgba(124,58,237,0.15)] transition-all hover:shadow-[0_16px_48px_rgba(124,58,237,0.2)]">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Join Room by ID🗝️</h2>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center">
                <input
                  type="text"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  placeholder="Enter Room ID"
                  className="flex-grow bg-white/80 border border-gray-300 rounded-2xl px-6 py-4 text-lg placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-300 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-inner mx-auto sm:mx-0"
                  aria-label="Enter room ID to join"
                />
                <button
                  onClick={handleJoinRoomById}
                  className="px-7 py-4 rounded-2xl font-semibold text-white text-lg transition-all shadow-lg bg-gradient-to-r from-teal-600 to-purple-500 hover:from-teal-700 hover:to-purple-600"
                  aria-label="Join room by ID"
                >
                  Join Room
                </button>
              </div>
            </section>
          </div>

          {/* Room List */}
          <RoomList
            rooms={rooms.map((room) => ({
              id: room.id,
              slug: room.slug,
              name: room.name,
            }))}
            onDelete={handleDeleteRoom}
          />


        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
