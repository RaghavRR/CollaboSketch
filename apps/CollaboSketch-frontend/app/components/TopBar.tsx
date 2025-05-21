"use client";

import { ReactNode, useState } from "react";
import { IconButton } from "./IconButton";
import { Copy, Check, Pencil } from "lucide-react"; // Added Check icon
import { toast } from "sonner";

interface TopBarProps {
  roomName?: string;
  icons: {
    icon: ReactNode;
    onClick: () => void;
    activated: boolean;
    title?: string;
  }[];
}

export function TopBar({ icons, roomName }: TopBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (roomName) {
      navigator.clipboard.writeText(roomName);
      setCopied(true);
      toast.success("Room name copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 py-3 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 shadow-md">
      {/* Top Row: Logo + Room ID */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        {/* Logo Section */}
        <div className="flex items-center gap-3 justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-100 to-teal-100 p-2 rounded-full shadow-md">
              <Pencil className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-teal-500 text-transparent bg-clip-text select-none">
              CollaboSketch
            </span>
          </div>

          {/* Room ID on small screens */}
        <div
        className="sm:hidden flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg text-gray-300 text-base font-semibold cursor-pointer hover:border-teal-500 hover:text-teal-400 transition-all duration-200 select-none shadow"
        onClick={handleCopy}
        title={copied ? "Copied!" : "Click to copy room Id"}
        >
        <span className="truncate max-w-[160px]">
            {roomName || "Untitled Room"}
        </span>
        {copied ? (
            <Check size={22} className="text-green-400" />
        ) : (
            <Copy size={22} />
        )}
        </div>

        </div>

        {/* Room ID on desktop */}
        <div
        className="hidden sm:flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg text-gray-300 text-base font-semibold cursor-pointer hover:border-teal-500 hover:text-teal-400 transition-all duration-200 select-none max-w-[220px] shadow"
        onClick={handleCopy}
        title={copied ? "Copied!" : "Click to copy room name"}
        >
        <span className="truncate">{roomName || "Untitled Room"}</span>
        {copied ? (
            <Check size={20} className="text-green-400" />
        ) : (
            <Copy size={20} />
        )}
        </div>
      </div>

      {/* Icon Buttons Row */}
      <div className="mt-3 sm:mt-0 flex flex-wrap justify-center sm:justify-center gap-2 sm:gap-3">
        {icons.map((btn, idx) => (
          <IconButton
            key={idx}
            icon={btn.icon}
            onClick={btn.onClick}
            activated={btn.activated}
            title={btn.title}
            // @ts-expect-error
            className="h-7 w-7 sm:h-10 sm:w-10"
          />
        ))}
      </div>
    </div>
  );
}
