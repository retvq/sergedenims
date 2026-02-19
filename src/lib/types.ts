export type ReviewVerdict = "possible" | "depends" | "not_possible";
export type MessageType = "design_upload" | "review" | "user_text" | "admin_text";
export type SenderRole = "user" | "admin";
export type ConversationStatus = "open" | "order_accepted" | "order_declined";

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  status: ConversationStatus;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_role: SenderRole;
  message_type: MessageType;
  body: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  link_url: string | null;
  verdict: ReviewVerdict | null;
  created_at: string;
}
