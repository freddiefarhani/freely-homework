import { User } from '../../types';

export interface UserModel {
  createUser(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  deleteUser(id: string): Promise<void>;
}
