import { SQSEvent, SQSHandler } from 'aws-lambda';
import { MessageService } from '../services/messageService';
import { MessageRepository } from '../database/repository/messageRepository';
import { Logger } from '../utils/logger';
interface MessageData {
  content: string;
  authorId: string;
}

export const handleCreateMessage: SQSHandler = async (event: SQSEvent) => {
  try {
    Logger.info('handleCreateMessage received, event:', event);
    const messageService = new MessageService(new MessageRepository());

    for (const record of event.Records) {
      const { body } = record;
      const { content, authorId } = JSON.parse(body) as MessageData;

      const createdMessage = await messageService.createMessage({
        content,
        authorId,
      });

      Logger.debug('Message created:', createdMessage);
    }

    Logger.info('All messages are created successfully!');
  } catch (error) {
    Logger.error('Failed to create messages:', error);
    throw error;
    /**
     * We throw here so SQS retries the entire batch even the successful ones one which is not ideal
     * So it's good to implement individual process mechanism for each message
     */
  }
};
