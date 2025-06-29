import { Bus, CreateBusRequest, UpdateBusRequest } from '../Bus';
import { IActivatable, IBaseRepository, ISearchable } from './IBaseRepository';

// Interface Segregation Principle - Interfaz específica para buses
export interface IBusRepository extends 
    IBaseRepository<Bus, CreateBusRequest, UpdateBusRequest>, 
    ISearchable<Bus>, 
    IActivatable {
    
    // Métodos específicos para buses
    getByPlaca(placa: string): Promise<Bus | null>;
    getByCooperativa(cooperativaId: number): Promise<Bus[]>;
    getByEstructura(estructuraId: string): Promise<Bus[]>;
    updateImages(id: string, images: (string | null)[]): Promise<Bus>;
}
