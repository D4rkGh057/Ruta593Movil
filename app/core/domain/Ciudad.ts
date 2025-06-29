// Interfaces para el dominio de Ciudad
export interface Ciudad {
    id?: string;
    id_provincia: string;
    nombre: string;
}

export interface CreateCiudadRequest {
    id_provincia: string;
    nombre: string;
}

export interface UpdateCiudadRequest {
    id_provincia?: string;
    nombre?: string;
}

export interface CiudadResponse {
    id_provincia: string;
    nombre: string;
}
