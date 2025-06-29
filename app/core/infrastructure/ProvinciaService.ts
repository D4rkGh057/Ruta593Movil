import { API_ENDPOINTS } from "../../../config/api";
import { CreateProvinciaRequest, Provincia, UpdateProvinciaRequest } from "../domain/Provincia";
import { IProvinciaRepository } from "../domain/interfaces/IProvinciaRepository";
import { BaseHttpService } from "./BaseHttpService";

// Dependency Inversion Principle - Implementación concreta del repositorio de provincias
export class ProvinciaService extends BaseHttpService implements IProvinciaRepository {
    
    // Single Responsibility Principle - Crear provincia
    async create(provinciaData: CreateProvinciaRequest): Promise<Provincia> {
        try {
            return await this.post<Provincia>(API_ENDPOINTS.PROVINCIAS.CREATE, provinciaData);
        } catch (error) {
            this.handleError(error);
        }
    }

    // Single Responsibility Principle - Obtener todas las provincias
    async getAll(): Promise<Provincia[]> {
        try {
            return await this.get<Provincia[]>(API_ENDPOINTS.PROVINCIAS.GET_ALL);
        } catch (error) {
            this.handleError(error);
        }
    }

    // Single Responsibility Principle - Obtener provincia por ID
    async getById(id: string): Promise<Provincia | null> {
        try {
            return await this.get<Provincia>(API_ENDPOINTS.PROVINCIAS.GET_BY_ID(id));
        } catch (error) {
            if (error instanceof Error && error.message.includes('404')) {
                return null;
            }
            this.handleError(error);
        }
    }

    // Single Responsibility Principle - Actualizar provincia
    async update(id: string, updates: UpdateProvinciaRequest): Promise<Provincia> {
        try {
            return await this.put<Provincia>(API_ENDPOINTS.PROVINCIAS.UPDATE(id), updates);
        } catch (error) {
            this.handleError(error);
        }
    }

    // Single Responsibility Principle - Eliminar provincia
    async delete(id: string): Promise<void> {
        try {
            await this.deleteRequest<void>(API_ENDPOINTS.PROVINCIAS.DELETE(id));
        } catch (error) {
            this.handleError(error);
        }
    }

    // Interface Segregation Principle - Método específico para búsqueda
    async search(criteria: any): Promise<Provincia[]> {
        try {
            if (criteria.nombre) {
                return await this.searchByName(criteria.nombre);
            }
            return [];
        } catch (error) {
            this.handleError(error);
        }
    }

    // Método específico para obtener por nombre
    async getByName(nombre: string): Promise<Provincia | null> {
        try {
            const provincias = await this.getAll();
            return provincias.find(provincia => 
                provincia.nombre.toLowerCase() === nombre.toLowerCase()
            ) || null;
        } catch (error) {
            this.handleError(error);
        }
    }

    // Método específico para búsqueda por nombre (parcial)
    async searchByName(nombre: string): Promise<Provincia[]> {
        try {
            const provincias = await this.getAll();
            return provincias.filter(provincia => 
                provincia.nombre.toLowerCase().includes(nombre.toLowerCase())
            );
        } catch (error) {
            this.handleError(error);
        }
    }
}
