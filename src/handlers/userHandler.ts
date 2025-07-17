import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';
import z from 'zod';
import { UserService } from '../services/userService';
import { UserRepository } from '../database';
import { Logger } from '../utils/logger';

const userService = new UserService(new UserRepository());

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
    userService.registerUser(validateData);
    Logger.info('Operation Successful', validateData);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User registered successfully!' }),
    };
  } catch (error) {
    Logger.error('Error during user registration', error);

    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Validation error!',
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
