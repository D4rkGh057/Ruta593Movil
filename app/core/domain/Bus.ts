export interface Bus {
    bus_id?: number;
    numero_bus: number;
    placa: string;
    chasis: string;
    carroceria: string;
    total_asientos_normales: number;
    total_asientos_vip: number;
    activo?: boolean;
    files?: (string | null)[];
    id_estructura_bus: string;
    fecha_creacion?: string;
    asientos?: {
        asiento_id: number;
        tipo_asiento: string;
        numero_asiento: number;
        fecha_creacion: string;
    }[];
}

export interface CreateBusRequest {
    numero_bus: number;
    placa: string;
    chasis: string;
    carroceria: string;
    total_asientos_normales: number;
    total_asientos_vip: number;
    files?: File[];
    id_estructura_bus: string;
}

export interface UpdateBusRequest {
    activo?: boolean;
    numero_bus?: number;
    placa?: string;
    chasis?: string;
    carroceria?: string;
    total_asientos_normales?: number;
    total_asientos_vip?: number;
    id_estructura_bus?: string;
}

export interface BusResponse {
    numero_bus: number;
    placa: string;
    chasis: string;
    carroceria: string;
    total_asientos_normales: number;
    total_asientos_vip: number;
    files: (string | null)[];
    id_estructura_bus: string;
}
