import { CreateFrecuenciaRequest, Frecuencia, UpdateFrecuenciaRequest } from '../Frecuencia';
import { IActivatable, IBaseRepository, ISearchable } from './IBaseRepository';

// Interface Segregation Principle - Interfaz específica para frecuencias
export interface IFrecuenciaRepository extends 
    IBaseRepository<Frecuencia, CreateFrecuenciaRequest, UpdateFrecuenciaRequest>, 
    ISearchable<Frecuencia>, 
    IActivatable {
    
    // Métodos específicos para frecuencias
    getByConductor(conductorId: string): Promise<Frecuencia[]>;
    getByBus(busId: string): Promise<Frecuencia[]>;
    getByOrigen(origen: string): Promise<Frecuencia[]>;
    getByDestino(destino: string): Promise<Frecuencia[]>;
    getByProvincia(provincia: string): Promise<Frecuencia[]>;
    getByRoute(origen: string, destino: string): Promise<Frecuencia[]>;
}
