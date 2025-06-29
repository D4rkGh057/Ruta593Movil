// Interfaces para el dominio de Viaje
export interface Viaje {
    id?: string;
    fecha_salida: string;
    num_asientos_disponibles: number;
    num_asientos_ocupados: number;
    id_frecuencia: {
        frecuencia_id: number;
    };
}

export interface CreateViajeRequest {
    fecha_salida: string;
    num_asientos_disponibles: number;
    num_asientos_ocupados: number;
    id_frecuencia: {
        frecuencia_id: number;
    };
}

export interface UpdateViajeRequest {
    fecha_salida?: string;
    num_asientos_disponibles?: number;
    num_asientos_ocupados?: number;
    id_frecuencia?: {
        frecuencia_id: number;
    };
    id_viaje?: string;
}

export interface ViajeResponse {
    fecha_salida: string;
    num_asientos_disponibles: number;
    num_asientos_ocupados: number;
    id_frecuencia: {
        frecuencia_id: number;
    };
}
