import { CreateUserRequest, UpdateUserRequest, User } from "../../domain/User";
import { ApiResponse } from "../../domain/interfaces/IBaseUseCase";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import {
    ICreateUserUseCase,
    IDeleteUserUseCase,
    IGetAllUsersUseCase,
    IGetUserByCedulaUseCase,
    IGetUserByIdUseCase,
    ISearchUserByNameUseCase,
    IUpdateUserRoleUseCase,
    IUpdateUserUseCase
} from "../../domain/interfaces/IUserUseCases";

// Single Responsibility Principle - Cada caso de uso tiene una responsabilidad específica
// Dependency Inversion Principle - Depende de abstracciones, no de concreciones

export class CreateUserUseCase implements ICreateUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(request: CreateUserRequest): Promise<ApiResponse<User>> {
        try {
            const user = await this.userRepository.create(request);
            return {
                success: true,
                data: user,
                message: 'Usuario creado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error al crear usuario'
            };
        }
    }
}

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(): Promise<ApiResponse<User[]>> {
        try {
            const users = await this.userRepository.getAll();
            return {
                success: true,
                data: users,
                message: 'Usuarios obtenidos exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error al obtener usuarios'
            };
        }
    }
}

export class GetUserByIdUseCase implements IGetUserByIdUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(id: string): Promise<ApiResponse<User>> {
        try {
            const user = await this.userRepository.getById(id);
            if (!user) {
                return {
                    success: false,
                    error: 'Usuario no encontrado'
                };
            }
            return {
                success: true,
                data: user,
                message: 'Usuario obtenido exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error al obtener usuario'
            };
        }
    }
}

export class UpdateUserUseCase implements IUpdateUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(request: {id: string; updates: UpdateUserRequest}): Promise<ApiResponse<User>> {
        try {
            const user = await this.userRepository.update(request.id, request.updates);
            return {
                success: true,
                data: user,
                message: 'Usuario actualizado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error al actualizar usuario'
            };
        }
    }
}

export class DeleteUserUseCase implements IDeleteUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(id: string): Promise<ApiResponse<void>> {
        try {
            await this.userRepository.delete(id);
            return {
                success: true,
                message: 'Usuario eliminado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error al eliminar usuario'
            };
        }
    }
}

export class SearchUserByNameUseCase implements ISearchUserByNameUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(name: string): Promise<ApiResponse<User[]>> {
        try {
            const users = await this.userRepository.searchByName(name);
            return {
                success: true,
                data: users,
                message: 'Búsqueda completada exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error al buscar usuarios'
            };
        }
    }
}

export class GetUserByCedulaUseCase implements IGetUserByCedulaUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(cedula: string): Promise<ApiResponse<User>> {
        try {
            const user = await this.userRepository.getByCedula(cedula);
            if (!user) {
                return {
                    success: false,
                    error: 'Usuario no encontrado'
                };
            }
            return {
                success: true,
                data: user,
                message: 'Usuario obtenido exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error al obtener usuario'
            };
        }
    }
}

export class UpdateUserRoleUseCase implements IUpdateUserRoleUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(request: {id: string; role: string}): Promise<ApiResponse<User>> {
        try {
            const user = await this.userRepository.updateRole(request.id, request.role);
            return {
                success: true,
                data: user,
                message: 'Rol de usuario actualizado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error al actualizar rol de usuario'
            };
        }
    }
}
