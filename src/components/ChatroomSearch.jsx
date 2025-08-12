import React, { useState, useEffect } from "react";

export default function ChatroomSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm.trim());
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch]);

  return (
    <input
      type="text"
      placeholder="Search chatrooms..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="input input-bordered w-full"
    />
  );
}
