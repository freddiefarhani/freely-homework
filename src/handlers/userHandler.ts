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

export const getUserByEmail: APIGatewayProxyHandler = async event => {
  try {
    Logger.info('Get user by email is called', event);

    const { email } = event.pathParameters || {};

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email is required!' }),
      };
    }
    const user = await userService.getUserByEmail(email);

    return user
      ? {
          statusCode: 200,
          body: JSON.stringify(user),
        }
      : {
          statusCode: 404,
          body: JSON.stringify({ message: 'User not found!' }),
        };
  } catch (error) {
    Logger.error('Error during get user by email', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: (error as Error).message || 'Internal server error',
      }),
    };
  }
};

export const deleteUserById: APIGatewayProxyHandler = async event => {
  try {
    Logger.info('Delete user by id is called', event);
    const { id } = event.pathParameters || {};
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Id is required!' }),
      };
    }
    const user = await userService.getUserById(id);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found!' }),
      };
    }

    await userService.deleteUser(id);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User deleted successfully!' }),
    };
  } catch (error) {
    Logger.error('Error during delete user by id', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: (error as Error).message || 'Internal server error',
      }),
    };
  }
};
