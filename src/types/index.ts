//////////////////////// User types ////////////////////////
export interface RegistrationData {
  name: string;
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

//////////////////////// Message types ////////////////////////
export interface MessageData {
  content: string;
  authorId: string;
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}
