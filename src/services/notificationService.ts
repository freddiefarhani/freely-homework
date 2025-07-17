import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { RegistrationData } from '../types';
import { Logger } from '../utils/logger';

export class NotificationService {
  private snsClient: SNSClient;
  private topic: string;

  constructor() {
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION || 'ap-southeast-2',
    });
    this.topic = process.env.SNS_TOPIC || '';
  }
  async sendUserRegistrationNotification(
    userRegistrationData: RegistrationData
  ): Promise<void> {
    try {
      Logger.info(
        `Attempting to send SNS notification, topic: ${this.topic}`,
        userRegistrationData
      );

      if (!this.topic) {
        throw new Error('SNS topic is not configured');
      }

      const message = JSON.stringify({
        message: 'New user registration',
        data: userRegistrationData,
      });

      Logger.info(`Publishing message to SNS, topic: ${this.topic}`, message);

      await this.snsClient.send(
        new PublishCommand({
          TopicArn: this.topic,
          Message: message,
        })
      );
      Logger.info('User registration notification sent successfully');
    } catch (error) {
      Logger.error('Failed to send user registration notification', error);

      throw new Error(
        'NotificationService: Failed to send user registration notification:' +
          (error as Error).message
      );
    }
  }
}
