import { User } from '../domain/User';

export interface LoginPort {
  login(email: string, password: string): Promise<{ user: User; token: string }>;
}

export class LoginUseCase {
  private readonly loginPort: LoginPort;

  constructor(loginPort: LoginPort) {
    this.loginPort = loginPort;
  }

  async execute(email: string, password: string): Promise<{ user: User; token: string }> {
    // Aquí se puede agregar lógica de validación, etc.
    return this.loginPort.login(email, password);
  }
}
