export interface Cooperativa {
    cooperativa_id?: number;
    nombre: string;
    telefono: string;
    correo: string;
    logo: string;
    ruc: string;
    direccion: string;
    fecha_creacion?: string;
    activo?: boolean;
}

export interface CreateCooperativaRequest {
    nombre: string;
    telefono: string;
    correo: string;
    ruc: string;
    direccion: string;
    logo: File;
}

export interface UpdateCooperativaRequest {
    nombre?: string;
    telefono?: string;
    correo?: string;
    ruc?: string;
    direccion?: string;
    logo?: File;
}

export interface CooperativaResponse {
    nombre: string;
    telefono: string;
    correo: string;
    logo: string;
    ruc: string;
    direccion: string;
}
