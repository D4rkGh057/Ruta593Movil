import { CreateProvinciaRequest, Provincia, UpdateProvinciaRequest } from '../Provincia';
import { IBaseRepository, ISearchable } from './IBaseRepository';

export interface IProvinciaRepository extends 
    IBaseRepository<Provincia, CreateProvinciaRequest, UpdateProvinciaRequest>, 
    ISearchable<Provincia> {
    
    // Métodos específicos para provincias
    getByName(nombre: string): Promise<Provincia | null>;
    searchByName(nombre: string): Promise<Provincia[]>;
}
