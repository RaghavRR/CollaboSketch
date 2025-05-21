import { ClipboardCopy, Trash2 } from "lucide-react";
import { useState } from "react";

interface Room {
  id: string;
  slug: string;
  status?: string;
  name?: string;
}

interface RoomListProps {
  rooms: Room[];
  onDelete?: (id: string) => void;
}

export function RoomList({ rooms, onDelete }: RoomListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      alert("Failed to copy!");
    }
  };

const getDisplayName = (room: Room) => {
  const trimmedName = room.name?.trim();
  const fallback = room.slug || `room-${room.id.slice(0, 6)}`;
  return trimmedName || fallback;
};

  return (
    <section className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-10 text-center text-black select-none">
        Your Rooms🚪
      </h2>

      {rooms.length === 0 ? (
        <p className="text-gray-400 text-lg text-center py-28 italic select-none">
          No rooms yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <article
              key={`${room.id}-${index}`}
              role="region"
              aria-labelledby={`room-title-${room.id}`}
              className="
                bg-white/10 backdrop-blur-md
                border border-white/20 rounded-3xl
                shadow-lg shadow-purple-400/10
                flex flex-col overflow-hidden
                transition hover:shadow-purple-500/40
                hover:scale-[1.03] duration-300
              "
            >
            
              {/* Glass header with room name and ID */}
              <header className="bg-white/30 backdrop-blur-lg border-b border-white/40 px-6 py-4 select-text cursor-default">
                <h3
                  id={`room-title-${room.id}`}
                  className="text-xl font-bold text-purple-900 truncate"
                  title={room.slug}
                >
                  {getDisplayName(room)}
                </h3>
              </header>

              {/* Card body */}
              <div className="p-6 flex flex-col flex-grow justify-between text-purple-200 font-mono text-sm">
                <div className="mb-6 flex items-center gap-3 select-text text-purple-500">
                  <span className="truncate font-semibold text-purple-600">ID: {room.id}</span>

                  <span
                    title="Copy room ID"
                    role="button"
                    tabIndex={0}
                    aria-label={`Copy room ID ${room.id}`}
                    onClick={() => handleCopy(room.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleCopy(room.id);
                    }}
                    className="inline-flex cursor-pointer text-purple-500 hover:text-purple-700 transition-colors duration-200"
                  >
                    <ClipboardCopy className="w-5 h-5" />
                  </span>

                  {copiedId === room.id && (
                    <span className="text-green-400 text-xs ml-2 select-none font-semibold">Copied!</span>
                  )}
                </div>


                <p className="mb-8 font-semibold uppercase tracking-wider text-purple-500">
                  Status:{" "}
                  <span
                    className={`
                      capitalize font-bold 
                      ${
                        room.status?.toLowerCase() === "active" || !room.status
                          ? "text-green-500"
                          : "text-purple-300"
                      }
                    `}
                  >
                    {room.status || "active"}
                  </span>
                </p>

                <button
                  onClick={() => onDelete?.(room.id)}
                  type="button"
                  aria-label={`Delete room ${room.slug}`}
                  className="
                    self-start inline-flex items-center gap-2 px-5 py-2
                    bg-red-600 bg-opacity-70 hover:bg-red-700 focus:bg-red-800
                    text-white font-semibold rounded-xl shadow-md
                    transition focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-offset-1
                  "
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
