export type TChat = {
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  image?: string;
  _id?: string;
  isGroup?: boolean;
  members?: any[];
  messages?: any[];
  lastMessage?: any;
};
export type TPeople = {
  email?: string;
  name?: string;
  image?: string;
  _id?: string;
  createdAt?: string;
};
export type TMessage = {
  _id?: string;
  body?: string;
  image?: string;
  chat?: string;
  sender?: {
    _id: string;
    name: string;
    image?: string;
  };
  seen?: [{ _id: string; name: string }];
  createdAt?: string;
  updatedAt?: string;
};
export type TSessionUser = {
  email?: string | null;
  name?: string | null;
  image?: string | null;
  _id?: string | null;
};
