// Casos de uso base siguiendo Single Responsibility Principle
export interface IBaseUseCase<TRequest, TResponse> {
    execute(request: TRequest): Promise<TResponse>;
}

// Interfaz para casos de uso sin parámetros
export interface IBaseUseCaseNoParams<TResponse> {
    execute(): Promise<TResponse>;
}

// Tipos de respuesta estándar
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
