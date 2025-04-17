import { IUser } from '../models/User';

export interface IUserService {
  createUser(user: IUser): Promise<IUser>;
  getUserById(userId: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  updateUser(userId: string, user: Partial<IUser>): Promise<IUser | null>;
  deleteUser(userId: string): Promise<boolean>;
  generateUserId(): Promise<string>;
}
