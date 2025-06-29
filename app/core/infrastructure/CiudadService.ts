import { API_ENDPOINTS } from "../../../config/api";
import { Ciudad, CreateCiudadRequest, UpdateCiudadRequest } from "../domain/Ciudad";
import { IBaseRepository, ISearchable } from "../domain/interfaces/IBaseRepository";
import { BaseHttpService } from "./BaseHttpService";

// Interface Segregation Principle - Interfaz específica para ciudades
interface ICiudadRepository extends IBaseRepository<Ciudad, CreateCiudadRequest, UpdateCiudadRequest>, ISearchable<Ciudad> {
    getByProvincia(provinciaId: string): Promise<Ciudad[]>;
    getByName(nombre: string): Promise<Ciudad | null>;
    searchByName(nombre: string): Promise<Ciudad[]>;
}

// Dependency Inversion Principle - Implementación concreta del repositorio de ciudades
export class CiudadService extends BaseHttpService implements ICiudadRepository {
    
    // Single Responsibility Principle - Crear ciudad
    async create(ciudadData: CreateCiudadRequest): Promise<Ciudad> {
        try {
            return await this.post<Ciudad>(API_ENDPOINTS.CIUDADES.CREATE, ciudadData);
        } catch (error) {
            this.handleError(error);
        }
    }

    // Single Responsibility Principle - Obtener todas las ciudades
    async getAll(): Promise<Ciudad[]> {
        try {
            return await this.get<Ciudad[]>(API_ENDPOINTS.CIUDADES.GET_ALL);
        } catch (error) {
            this.handleError(error);
        }
    }

    // Single Responsibility Principle - Obtener ciudad por ID
    async getById(id: string): Promise<Ciudad | null> {
        try {
            return await this.get<Ciudad>(API_ENDPOINTS.CIUDADES.GET_BY_ID(id));
        } catch (error) {
            if (error instanceof Error && error.message.includes('404')) {
                return null;
            }
            this.handleError(error);
        }
    }

    // Single Responsibility Principle - Actualizar ciudad
    async update(id: string, updates: UpdateCiudadRequest): Promise<Ciudad> {
        try {
            return await this.put<Ciudad>(API_ENDPOINTS.CIUDADES.UPDATE(id), updates);
        } catch (error) {
            this.handleError(error);
        }
    }

    // Single Responsibility Principle - Eliminar ciudad
    async delete(id: string): Promise<void> {
        try {
            await this.deleteRequest<void>(API_ENDPOINTS.CIUDADES.DELETE(id));
        } catch (error) {
            this.handleError(error);
        }
    }

    // Interface Segregation Principle - Método específico para búsqueda
    async search(criteria: any): Promise<Ciudad[]> {
        try {
            if (criteria.nombre) {
                return await this.searchByName(criteria.nombre);
            }
            if (criteria.provincia) {
                return await this.getByProvincia(criteria.provincia);
            }
            return [];
        } catch (error) {
            this.handleError(error);
        }
    }

    // Método específico para obtener por provincia
    async getByProvincia(provinciaId: string): Promise<Ciudad[]> {
        try {
            const ciudades = await this.getAll();
            return ciudades.filter(ciudad => ciudad.id_provincia === provinciaId);
        } catch (error) {
            this.handleError(error);
        }
    }

    // Método específico para obtener por nombre
    async getByName(nombre: string): Promise<Ciudad | null> {
        try {
            const ciudades = await this.getAll();
            return ciudades.find(ciudad => 
                ciudad.nombre.toLowerCase() === nombre.toLowerCase()
            ) || null;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Método específico para búsqueda por nombre (parcial)
    async searchByName(nombre: string): Promise<Ciudad[]> {
        try {
            const ciudades = await this.getAll();
            return ciudades.filter(ciudad => 
                ciudad.nombre.toLowerCase().includes(nombre.toLowerCase())
            );
        } catch (error) {
            this.handleError(error);
        }
    }
}
