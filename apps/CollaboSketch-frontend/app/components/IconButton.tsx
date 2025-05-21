import { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated,
  title,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none w-11 h-11 sm:w-12 sm:h-12
        ${activated
          ? "bg-gradient-to-br from-red-500 to-pink-500 text-white border-red-400 shadow-md scale-[1.05]"
          : "bg-zinc-800 text-gray-300 border-zinc-700 hover:scale-105 hover:text-white hover:border-pink-400"
        }`}
      style={{
        boxShadow: activated
          ? "0 4px 14px rgba(255, 100, 100, 0.4)"
          : "0 2px 6px rgba(0, 0, 0, 0.3)",
      }}
    >
      <span className="text-lg sm:text-xl">{icon}</span>
    </button>
  );
}
