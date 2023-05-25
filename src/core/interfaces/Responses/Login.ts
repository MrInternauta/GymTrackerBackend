import { User } from '../../../users/entities/user.entity';

export interface AuthSuccess {
  access_token: string;
  user: User;
}
