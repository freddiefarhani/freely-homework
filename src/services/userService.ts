// User service - Business logic for user operations
import { RegistrationData, User } from '../types';
import { UserModel } from '../database/models/user';
import { Logger } from '../utils/logger';

export class UserService {
  constructor(private userModel: UserModel) {}

  async registerUser(registrationData: RegistrationData): Promise<User> {
    Logger.info('Registering user with data:', registrationData);
    return await this.userModel.createUser(registrationData);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.getUserByEmail(email);
  }

  async deleteUser(id: string): Promise<void> {
    return await this.userModel.deleteUser(id);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userModel.getUserById(id);
  }
}
