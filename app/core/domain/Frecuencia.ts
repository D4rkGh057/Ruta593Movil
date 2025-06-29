export interface Frecuencia {
    frecuencia_id?: number;
    nombre_frecuencia: string;
    bus_id: string;
    conductor_id: string;
    cooperativa_id?: number;
    hora_salida: string;
    hora_llegada: string;
    origen: string;
    destino: string;
    provincia: string;
    activo: boolean;
    total: number;
    nro_aprobacion: string;
    es_directo: boolean;
    fecha_creacion?: string;
    conductor?: any;
    bus?: any;
    rutas?: any[];
}

export interface CreateFrecuenciaRequest {
    nombre_frecuencia: string;
    bus_id: string;
    conductor_id: string;
    hora_salida: string;
    hora_llegada: string;
    origen: string;
    destino: string;
    provincia: string;
    activo: boolean;
    total: number;
    nro_aprobacion: string;
    es_directo: boolean;
}

export interface UpdateFrecuenciaRequest {
    id?: number;
    nombre?: string;
    descripcion?: string;
    nombre_frecuencia?: string;
    bus_id?: string;
    conductor_id?: string;
    hora_salida?: string;
    hora_llegada?: string;
    origen?: string;
    destino?: string;
    provincia?: string;
    activo?: boolean;
    total?: number;
    nro_aprobacion?: string;
    es_directo?: boolean;
}

export interface FrecuenciaResponse {
    frecuencia_id?: number;
    nombre_frecuencia: string;
    bus_id: string;
    conductor_id: string;
    hora_salida: string;
    hora_llegada: string;
    origen: string;
    destino: string;
    provincia: string;
    activo: boolean;
    total: number;
    nro_aprobacion: string;
    es_directo: boolean;
}
