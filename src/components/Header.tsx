"use client";

interface HeaderProps {
  activeTab: "user" | "admin";
  onTabChange: (tab: "user" | "admin") => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-sdn-gray-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-[0.2em] text-sdn-black uppercase">
              Serge De Nimes
            </span>
          </div>
          <div className="text-sm text-sdn-black/60 tracking-wide">
            Design Request Demo
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-0 border-t border-sdn-gray-border">
          <button
            onClick={() => onTabChange("user")}
            className={`flex-1 py-3 text-sm font-semibold tracking-wide uppercase transition-colors ${
              activeTab === "user"
                ? "text-sdn-teal border-b-2 border-sdn-teal"
                : "text-sdn-black/50 hover:text-sdn-black border-b-2 border-transparent"
            }`}
          >
            Customer View
          </button>
          <button
            onClick={() => onTabChange("admin")}
            className={`flex-1 py-3 text-sm font-semibold tracking-wide uppercase transition-colors ${
              activeTab === "admin"
                ? "text-sdn-teal border-b-2 border-sdn-teal"
                : "text-sdn-black/50 hover:text-sdn-black border-b-2 border-transparent"
            }`}
          >
            Admin Panel
          </button>
        </div>
      </div>
    </header>
  );
}
