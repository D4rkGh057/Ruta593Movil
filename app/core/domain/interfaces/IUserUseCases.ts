import { CreateUserRequest, UpdateUserRequest, User } from '../User';
import { ApiResponse, IBaseUseCase, IBaseUseCaseNoParams } from './IBaseUseCase';

// Single Responsibility Principle - Cada caso de uso tiene una responsabilidad específica

export type ICreateUserUseCase = IBaseUseCase<CreateUserRequest, ApiResponse<User>>;

export type IGetAllUsersUseCase = IBaseUseCaseNoParams<ApiResponse<User[]>>;

export type IGetUserByIdUseCase = IBaseUseCase<string, ApiResponse<User>>;

export type IUpdateUserUseCase = IBaseUseCase<{id: string; updates: UpdateUserRequest}, ApiResponse<User>>;

export type IDeleteUserUseCase = IBaseUseCase<string, ApiResponse<void>>;

export type ISearchUserByNameUseCase = IBaseUseCase<string, ApiResponse<User[]>>;

export type IGetUserByCedulaUseCase = IBaseUseCase<string, ApiResponse<User>>;

export type IUpdateUserRoleUseCase = IBaseUseCase<{id: string; role: string}, ApiResponse<User>>;
