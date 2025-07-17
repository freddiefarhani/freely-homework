import { Message, MessageData } from '../types';
import { MessageModel } from '../database/models/message';

export class MessageService {
  constructor(private messageModel: MessageModel) {}

  async createMessage(messageData: MessageData): Promise<Message> {
    return this.messageModel.createMessage(messageData);
  }

  async getAllMessages(): Promise<Message[]> {
    return this.messageModel.getAllMessages();
  }

  async deleteMessage(id: string): Promise<void> {
    return this.messageModel.deleteMessage(id);
  }

  async getMessageById(id: string): Promise<Message | null> {
    return this.messageModel.getMessageById(id);
  }
}
