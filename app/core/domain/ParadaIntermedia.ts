// Interfaces para el dominio de Parada Intermedia
export interface ParadaIntermedia {
    id?: string;
    id_ruta: string;
    id_estacion: string;
    orden: number;
}

export interface CreateParadaIntermediaRequest {
    id_ruta: string;
    id_estacion: string;
    orden: number;
}

export interface UpdateParadaIntermediaRequest {
    id_ruta?: string;
    id_estacion?: string;
    orden?: number;
}

export interface ParadaIntermediaResponse {
    id_ruta: string;
    id_estacion: string;
    orden: number;
}
