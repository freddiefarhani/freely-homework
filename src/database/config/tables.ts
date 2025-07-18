export const DATABASE_CONFIG = {
  USERS_TABLE_NAME: process.env.USERS_TABLE_NAME || 'users',
  MESSAGES_TABLE_NAME: process.env.MESSAGES_TABLE_NAME || 'messages',
  REGION: 'ap-southeast-2',
  EMAIL_INDEX_NAME: 'email-index',
} as const;

export const USER_TABLE_SCHEMA = {
  TableName: DATABASE_CONFIG.USERS_TABLE_NAME,
  KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'email', AttributeType: 'S' },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: DATABASE_CONFIG.EMAIL_INDEX_NAME,
      KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
      Projection: {
        ProjectionType: 'ALL',
      },
    },
  ],
} as const;

export const MESSAGE_TABLE_SCHEMA = {
  TableName: DATABASE_CONFIG.MESSAGES_TABLE_NAME,
  KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
} as const;

