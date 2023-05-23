import { User } from '../../../users/entities/user.entity';

export interface LoginResponse {
  access_token: string;
  user: User;
}
