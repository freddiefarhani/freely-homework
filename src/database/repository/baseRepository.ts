import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { dbConnection } from '../config/connection';

export abstract class BaseRepository {
  protected docClient: DynamoDBDocumentClient;
  protected tableName: string;

  constructor(tableName: string) {
    this.docClient = dbConnection.getDocClient();
    this.tableName = tableName;
  }

  protected getTableName(): string {
    return this.tableName;
  }

  protected getDocClient(): DynamoDBDocumentClient {
    return this.docClient;
  }
}
