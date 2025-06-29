// Interfaz base para repositorios genéricos (Single Responsibility Principle)
export interface IBaseRepository<T, CreateRequest, UpdateRequest> {
    // Operaciones CRUD básicas
    create(entity: CreateRequest): Promise<T>;
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    update(id: string, updates: UpdateRequest): Promise<T>;
    delete(id: string): Promise<void>;
}

// Interfaz para operaciones de búsqueda (Interface Segregation Principle)
export interface ISearchable<T> {
    search(criteria: any): Promise<T[]>;
}

// Interfaz para operaciones paginadas (Interface Segregation Principle)
export interface IPaginable<T> {
    getPage(page: number, limit: number): Promise<{
        data: T[];
        total: number;
        page: number;
        limit: number;
    }>;
}

// Interfaz para entidades que pueden estar activas/inactivas
export interface IActivatable {
    activate(id: string): Promise<void>;
    deactivate(id: string): Promise<void>;
    getActive(): Promise<any[]>;
}
