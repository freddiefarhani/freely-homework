import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';
import z from 'zod';
import { UserService } from '../services/userService';
import { UserRepository } from '../database';
import { Logger } from '../utils/logger';
import { NotificationService } from '../services/notificationService';

const userService = new UserService(new UserRepository());
const notificationService = new NotificationService();

const EventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
});

export const userRegister: APIGatewayProxyHandler = async event => {
  try {
    Logger.info('User Registration is called', event);

    if (!event) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request!' }),
      };
    }

    const validateData = EventSchema.parse(event);

    const userExists = await userService.getUserByEmail(validateData.email);
    if (userExists) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'User already exists!' }),
      };
    }

    Logger.info(
      'About to send notification for user registration',
      validateData
    );
    await notificationService.sendUserRegistrationNotification(validateData);
    Logger.info(
      'Notification sent successfully, user registration is in progress...',
      validateData
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User registration is in progress!' }),
    };
  } catch (error) {
    Logger.error('Error during user registration', error);

    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Validation error, request format is incorrect!',
          errors: error.issues,
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: (error as Error).message || 'Internal server error',
      }),
    };
  }
};
