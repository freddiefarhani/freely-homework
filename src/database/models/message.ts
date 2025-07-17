import { Message, MessageData } from '../../types';

export interface MessageModel {
  createMessage(message: MessageData): Promise<Message>;
  getAllMessages(): Promise<Message[]>;
  deleteMessage(id: string): Promise<void>;
  getMessageById(id: string): Promise<Message | null>;
}
