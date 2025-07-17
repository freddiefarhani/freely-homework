import { RegistrationData, User } from '../../types';

export interface UserModel {
  createUser(userData: RegistrationData): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  deleteUser(id: string): Promise<void>;
}
