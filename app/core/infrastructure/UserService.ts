import { API_ENDPOINTS } from "../../../config/api";
import { CreateUserRequest, UpdateUserRequest, User } from "../domain/User";
import { IUserRepository } from "../domain/interfaces/IUserRepository";
import { BaseHttpService } from "./BaseHttpService";

// Dependency Inversion Principle - Implementación concreta del repositorio de usuarios
export class UserService extends BaseHttpService implements IUserRepository {
    
    // Single Responsibility Principle - Crear usuario
    async create(userData: CreateUserRequest): Promise<User> {
        try {
            return await this.post<User>(API_ENDPOINTS.USUARIOS.CREATE, userData);
        } catch (error) {
            this.handleError(error);
        }
    }

    // Single Responsibility Principle - Obtener todos los usuarios
    async getAll(): Promise<User[]> {
        try {
            return await this.get<User[]>(API_ENDPOINTS.USUARIOS.GET_ALL);
        } catch (error) {
            this.handleError(error);
        }
    }

    // Single Responsibility Principle - Obtener usuario por ID
    async getById(id: string): Promise<User | null> {
        try {
            return await this.get<User>(API_ENDPOINTS.USUARIOS.GET_BY_ID(id));
        } catch (error) {
            if (error instanceof Error && error.message.includes('404')) {
                return null;
            }
            this.handleError(error);
        }
    }

    // Single Responsibility Principle - Actualizar usuario
    async update(id: string, updates: UpdateUserRequest): Promise<User> {
        try {
            return await this.put<User>(API_ENDPOINTS.USUARIOS.UPDATE(id), updates);
        } catch (error) {
            this.handleError(error);
        }
    }

    // Single Responsibility Principle - Eliminar usuario
    async delete(id: string): Promise<void> {
        try {
            await this.deleteRequest<void>(API_ENDPOINTS.USUARIOS.DELETE(id));
        } catch (error) {
            this.handleError(error);
        }
    }

    // Interface Segregation Principle - Método específico para búsqueda
    async search(criteria: any): Promise<User[]> {
        try {
            // Implementar lógica de búsqueda según criterios
            if (criteria.name) {
                return await this.searchByName(criteria.name);
            }
            if (criteria.cedula) {
                const user = await this.getByCedula(criteria.cedula);
                return user ? [user] : [];
            }
            return [];
        } catch (error) {
            this.handleError(error);
        }
    }

    // Método específico para obtener por email
    async getByEmail(email: string): Promise<User | null> {
        try {
            // TODO: Implementar endpoint específico para búsqueda por email
            const users = await this.getAll();
            return users.find(user => user.correo === email) || null;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Método específico para obtener por cédula
    async getByCedula(cedula: string): Promise<User | null> {
        try {
            return await this.get<User>(API_ENDPOINTS.USUARIOS.GET_BY_CEDULA(cedula));
        } catch (error) {
            if (error instanceof Error && error.message.includes('404')) {
                return null;
            }
            this.handleError(error);
        }
    }

    // Método específico para búsqueda por nombre
    async searchByName(name: string): Promise<User[]> {
        try {
            return await this.get<User[]>(API_ENDPOINTS.USUARIOS.SEARCH_BY_NAME(name));
        } catch (error) {
            this.handleError(error);
        }
    }

    // Método específico para actualizar rol
    async updateRole(id: string, role: string): Promise<User> {
        try {
            return await this.update(id, { rol: role });
        } catch (error) {
            this.handleError(error);
        }
    }
}
