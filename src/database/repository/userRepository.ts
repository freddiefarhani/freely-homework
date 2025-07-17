// User repository - DynamoDB operations for user table
import {
  PutCommand,
  QueryCommand,
  DeleteCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { RegistrationData, User } from '../../types';
import { UserModel } from '../models/user';
import { BaseRepository } from './baseRepository';
import { v4 as uuidv4 } from 'uuid';

export class UserRepository extends BaseRepository implements UserModel {
  constructor() {
    super(process.env.USERS_TABLE_NAME || 'users');
  }

  async createUser(userData: RegistrationData): Promise<User> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const user: User = {
      id,
      ...userData,
      createdAt: now,
      updatedAt: now,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: user,
      })
    );

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      })
    );

    return (result.Items?.[0] as User) || null;
  }

  async deleteUser(id: string): Promise<void> {
    await this.docClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
      })
    );
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.docClient.send(
      new GetCommand({ TableName: this.tableName, Key: { id } })
    );
    return (result.Item as User) || null;
  }
}
