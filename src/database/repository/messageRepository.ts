import {
  PutCommand,
  ScanCommand,
  DeleteCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { Message, MessageData } from '../../types';
import { DATABASE_CONFIG } from '../config/tables';
import { MessageModel } from '../models/message';
import { BaseRepository } from './baseRepository';
import { v4 as uuidv4 } from 'uuid';

export class MessageRepository extends BaseRepository implements MessageModel {
  constructor() {
    super(DATABASE_CONFIG.MESSAGES_TABLE_NAME || 'messages');
  }

  async createMessage(messageData: MessageData): Promise<Message> {
    const id = uuidv4();
    const now = new Date().toISOString();

    const message: Message = {
      id,
      ...messageData,
      createdAt: now,
      updatedAt: now,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: message,
      })
    );

    return message;
  }

  async getAllMessages(): Promise<Message[]> {
    const result = await this.docClient.send(
      new ScanCommand({ TableName: this.tableName })
    );

    return result.Items as Message[];
  }

  async deleteMessage(id: string): Promise<void> {
    await this.docClient.send(
      new DeleteCommand({ TableName: this.tableName, Key: { id } })
    );
  }

  async getMessageById(id: string): Promise<Message | null> {
    const result = await this.docClient.send(
      new GetCommand({ TableName: this.tableName, Key: { id } })
    );

    return result.Item as Message | null;
  }
}
