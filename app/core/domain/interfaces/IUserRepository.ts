import { CreateUserRequest, UpdateUserRequest, User } from '../User';
import { IBaseRepository, ISearchable } from './IBaseRepository';

// Interface Segregation Principle - Interfaz específica para usuarios
export interface IUserRepository extends IBaseRepository<User, CreateUserRequest, UpdateUserRequest>, ISearchable<User> {
    // Métodos específicos para usuarios
    getByEmail(email: string): Promise<User | null>;
    getByCedula(cedula: string): Promise<User | null>;
    searchByName(name: string): Promise<User[]>;
    updateRole(id: string, role: string): Promise<User>;
}
