import z from 'zod';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { MessageRepository } from '../database/repository/messageRepository';
import { QueueService } from '../services/queueService';
import { MessageService } from '../services/messageService';
import { Logger } from '../utils/logger';

const messageService = new MessageService(new MessageRepository());
const queueService = new QueueService();

const CreateMessageSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  authorId: z.string().min(1, 'Author ID is required'),
});

const PostMessageSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  authorId: z.string().min(1, 'Author ID is required'),
});
export const createMessage: APIGatewayProxyHandler = async event => {
  try {
    Logger.info(`Creating message: ${event}`);
    if (!event.body) {
      throw new Error('Body is required');
    }
    const body = JSON.parse(event.body || '{}');
    const { content, authorId } = CreateMessageSchema.parse(body);

    await queueService.sendCreateMessage({ content, authorId });

    Logger.info(`Message created: ${content}, authorId: ${authorId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message creation is queued.' }),
    };
  } catch (error) {
    Logger.error(`Error creating message: ${error}`);
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: error.message,
          issues: error.issues,
        }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error creating message',
        error: (error as Error).message,
      }),
    };
  }
};

export const listMessages: APIGatewayProxyHandler = async event => {
  try {
    Logger.info(`Getting messages: ${event}`);

    const messages = await messageService.getAllMessages();

    Logger.debug(`Messages: ${messages}`);
    Logger.info('Messages fetched successfully!');

    return {
      statusCode: 200,
      body: JSON.stringify(messages),
    };
  } catch (error) {
    Logger.error(`Error fetching messages: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching messages' }),
    };
  }
};

export const deleteMessage: APIGatewayProxyHandler = async event => {
  try {
    Logger.info(`Deleting message: ${event}`);

    const { id } = event.pathParameters || {};

    if (!id) {
      throw new Error('Message ID is required');
    }

    const message = await messageService.getMessageById(id);
    Logger.debug(`Message: ${message}`);

    if (!message) {
      throw new Error('Message not found');
    }

    await messageService.deleteMessage(id);
    Logger.info(`Message deleted: ${id}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message deleted' }),
    };
  } catch (error) {
    Logger.error(`Error deleting message: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error deleting message' }),
    };
  }
};

export const postMessage: APIGatewayProxyHandler = async event => {
  try {
    Logger.info(`Posting message: ${event}`);

    const body = JSON.parse(event.body || '{}');
    const { content, authorId } = PostMessageSchema.parse(body);

    /**
     * Same as register user we can publish SNS event
     * and then we can subscribe to the event in the consumer
     */
    Logger.debug(`Message content: ${content}, authorId: ${authorId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message posted' }),
    };
  } catch (error) {
    Logger.error(`Error posting message: ${error}`);
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid request body',
          issues: error.issues,
        }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error posting message' }),
    };
  }
};
