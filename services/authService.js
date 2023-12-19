import { userService } from './userService.js';
import { errorMessages } from '../constants/errorMessages.js';

class AuthService {
  login(userData) {
    const user = userService.search(userData);
    if (!user) {
      throw Error(errorMessages.userNotFound);
    }
    return user;
  }
}

const authService = new AuthService();

export { authService };