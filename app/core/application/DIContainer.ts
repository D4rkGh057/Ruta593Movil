// Dependency Injection Container siguiendo Dependency Inversion Principle
import { IUserRepository } from "../domain/interfaces/IUserRepository";
import { CiudadService } from "../infrastructure/CiudadService";
import { ProvinciaService } from "../infrastructure/ProvinciaService";
import { UserService } from "../infrastructure/UserService";

import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetAllUsersUseCase,
    GetUserByCedulaUseCase,
    GetUserByIdUseCase,
    SearchUserByNameUseCase,
    UpdateUserRoleUseCase,
    UpdateUserUseCase
} from "./usecases/UserUseCases";

// Container para gestión de dependencias
export class DIContainer {
    private static instance: DIContainer;
    private services: Map<string, any> = new Map();

    private constructor() {
        this.registerServices();
    }

    public static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    private registerServices(): void {
        // Registrar servicios de infraestructura
        this.services.set('UserRepository', new UserService());
        this.services.set('ProvinciaService', new ProvinciaService());
        this.services.set('CiudadService', new CiudadService());

        // Registrar casos de uso de usuario
        const userRepository = this.get<IUserRepository>('UserRepository');
        this.services.set('CreateUserUseCase', new CreateUserUseCase(userRepository));
        this.services.set('GetAllUsersUseCase', new GetAllUsersUseCase(userRepository));
        this.services.set('GetUserByIdUseCase', new GetUserByIdUseCase(userRepository));
        this.services.set('UpdateUserUseCase', new UpdateUserUseCase(userRepository));
        this.services.set('DeleteUserUseCase', new DeleteUserUseCase(userRepository));
        this.services.set('SearchUserByNameUseCase', new SearchUserByNameUseCase(userRepository));
        this.services.set('GetUserByCedulaUseCase', new GetUserByCedulaUseCase(userRepository));
        this.services.set('UpdateUserRoleUseCase', new UpdateUserRoleUseCase(userRepository));
    }

    public get<T>(serviceName: string): T {
        const service = this.services.get(serviceName);
        if (!service) {
            throw new Error(`Service ${serviceName} not found`);
        }
        return service as T;
    }

    public register<T>(serviceName: string, service: T): void {
        this.services.set(serviceName, service);
    }
}

// Factory para obtener instancias de casos de uso
export class UseCaseFactory {
    private static container = DIContainer.getInstance();

    // User Use Cases
    static createUserUseCase() {
        return this.container.get<CreateUserUseCase>('CreateUserUseCase');
    }

    static getAllUsersUseCase() {
        return this.container.get<GetAllUsersUseCase>('GetAllUsersUseCase');
    }

    static getUserByIdUseCase() {
        return this.container.get<GetUserByIdUseCase>('GetUserByIdUseCase');
    }

    static updateUserUseCase() {
        return this.container.get<UpdateUserUseCase>('UpdateUserUseCase');
    }

    static deleteUserUseCase() {
        return this.container.get<DeleteUserUseCase>('DeleteUserUseCase');
    }

    static searchUserByNameUseCase() {
        return this.container.get<SearchUserByNameUseCase>('SearchUserByNameUseCase');
    }

    static getUserByCedulaUseCase() {
        return this.container.get<GetUserByCedulaUseCase>('GetUserByCedulaUseCase');
    }

    static updateUserRoleUseCase() {
        return this.container.get<UpdateUserRoleUseCase>('UpdateUserRoleUseCase');
    }

    // Services
    static userRepository() {
        return this.container.get<IUserRepository>('UserRepository');
    }

    static provinciaService() {
        return this.container.get<ProvinciaService>('ProvinciaService');
    }

    static ciudadService() {
        return this.container.get<CiudadService>('CiudadService');
    }
}
