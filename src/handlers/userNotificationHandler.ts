import { SNSEvent, SNSHandler } from 'aws-lambda';
import { Logger } from '../utils/logger';
import { RegistrationData } from '../types';
import { UserRepository } from '../database';
import { UserService } from '../services/userService';

export const handleUserRegistration: SNSHandler = async (event: SNSEvent) => {
  const userService = new UserService(new UserRepository());

  try {
    Logger.info('User registration event received', event);
    if (!event.Records || event.Records.length === 0) {
      throw new Error('No records found in the SNS event');
    }

    for (const record of event.Records) {
      const snsMessage = JSON.parse(record.Sns.Message);
      const message = snsMessage.data as RegistrationData;
      Logger.info('Processing user registration message');
      const user = await userService.registerUser({
        name: message.name,
        email: message.email,
      } as RegistrationData);
      Logger.info('User registered successfully', user);
    }
  } catch (error) {
    Logger.error('Error processing user registration:', error);
    // Handle error appropriately, e.g., send to a dead-letter queue and create another lambda to process/retry it
  }
};
