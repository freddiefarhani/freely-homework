import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Logger } from '../utils/logger';
import { MessageData } from '../types';
export class QueueService {
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION || 'ap-southeast-2',
    });
    this.queueUrl = process.env.CREATE_MESSAGE_QUEUE_URL || '';
  }

  async sendCreateMessage(message: MessageData): Promise<void> {
    try {
      Logger.info(
        `Sending create message to queue: ${this.queueUrl}, message: ${message}`
      );

      if (!this.queueUrl) {
        throw new Error('Queue URL is not set');
      }

      await this.sqsClient.send(
        new SendMessageCommand({
          QueueUrl: this.queueUrl,
          MessageBody: JSON.stringify(message),
        })
      );

      Logger.info(
        `Message sent to queue: ${this.queueUrl}, message: ${message}`
      );
    } catch (error) {
      Logger.error(`Error sending message to queue: ${error}`);
      throw new Error('Error sending message to queue');
      // If it fails here we need to implement:
      // retry mechanism, circuitBreaker, Fallback Strategy to be sure that the message is sent
    }
  }
}
