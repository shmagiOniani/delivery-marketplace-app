export interface Message {
  id: string;
  job_id?: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  receiver?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  job?: {
    id: string;
    title: string;
  };
}

export interface Conversation {
  id: string;
  other_user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  job?: {
    id: string;
    title: string;
  };
  last_message?: Message;
  unread_count: number;
  updated_at: string;
}

