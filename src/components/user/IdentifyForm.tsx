"use client";

import { useState } from "react";
import { User } from "@/lib/types";

interface IdentifyFormProps {
  onIdentified: (user: User) => void;
}

export default function IdentifyForm({ onIdentified }: IdentifyFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to identify user");
      }

      const user = await res.json();
      localStorage.setItem("sdn_user", JSON.stringify(user));
      onIdentified(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-wide text-sdn-black uppercase mb-2">
          Design Request
        </h2>
        <p className="text-sm text-sdn-black/60">
          Share your custom denim design ideas with us. Enter your details to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-sdn-black/70 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your full name"
            className="w-full px-4 py-3 border border-sdn-black/20 bg-white text-sdn-black placeholder:text-sdn-black/30 focus:outline-none focus:border-sdn-teal transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-sdn-black/70 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-sdn-black/20 bg-white text-sdn-black placeholder:text-sdn-black/30 focus:outline-none focus:border-sdn-teal transition-colors"
          />
        </div>

        {error && (
          <p className="text-sm text-sdn-red">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-sdn-teal text-white font-semibold uppercase tracking-wider text-sm hover:bg-sdn-teal/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Please wait..." : "Get Started"}
        </button>
      </form>
    </div>
  );
}
