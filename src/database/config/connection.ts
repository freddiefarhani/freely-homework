import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;

  private constructor() {
    this.client = new DynamoDBClient({
      region: 'ap-southeast-2',
    });
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getClient(): DynamoDBClient {
    return this.client;
  }

  public getDocClient(): DynamoDBDocumentClient {
    return this.docClient;
  }
}

export const dbConnection = DatabaseConnection.getInstance();
