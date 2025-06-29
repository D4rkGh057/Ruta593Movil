export interface Ruta {
    ruta_id?: number;
    frecuencia_id: string;
    parada_id: string;
    orden: number;
    distancia_parada: number;
    precio_parada: number;
    tiempo_parada: string;
    activo: boolean;
    fecha_creacion?: string;
    frecuencia?: any;
    parada?: any;
}

export interface CreateRutaRequest {
    frecuencia_id: string;
    parada_id: string;
    orden: number;
    distancia_parada: number;
    precio_parada: number;
    tiempo_parada: string;
    activo: boolean;
}

export interface UpdateRutaRequest {
    frecuencia_id?: string;
    parada_id?: string;
    orden?: number;
    distancia_parada?: number;
    precio_parada?: number;
    tiempo_parada?: string;
    activo?: boolean;
}

export interface RutaResponse {
    frecuencia_id: string;
    parada_id: string;
    orden: number;
    distancia_parada: number;
    precio_parada: number;
    tiempo_parada: string;
    activo: boolean;
}
