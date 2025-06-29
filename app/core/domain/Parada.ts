export interface Parada {
    parada_id?: number;
    ciudad: string;
    activo: boolean;
    fecha_creacion?: string;
}

export interface CreateParadaRequest {
    ciudad: string;
    activo: boolean;
}

export interface UpdateParadaRequest {
    ciudad?: string;
    activo?: boolean;
}

export interface ParadaResponse {
    ciudad: string;
    activo: boolean;
}
