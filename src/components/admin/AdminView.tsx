"use client";

import { useState } from "react";
import { Conversation } from "@/lib/types";
import ConversationList from "./ConversationList";
import AdminThread from "./AdminThread";

export default function AdminView() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  if (selectedConversation) {
    return (
      <AdminThread
        conversation={selectedConversation}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  return (
    <ConversationList onSelectConversation={setSelectedConversation} />
  );
}
