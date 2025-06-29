// Interfaces para el dominio de Provincia
export interface Provincia {
    id?: string;
    nombre: string;
}

export interface CreateProvinciaRequest {
    nombre: string;
}

export interface UpdateProvinciaRequest {
    nombre?: string;
}

export interface ProvinciaResponse {
    nombre: string;
}
