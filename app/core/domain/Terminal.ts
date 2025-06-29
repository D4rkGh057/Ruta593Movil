// Interfaces para el dominio de Terminal
export interface Terminal {
    id?: string;
    id_ciudad: string;
    nombre: string;
    direccion: string;
    telefono: string;
    hora_apertura: string;
    hora_cierre: string;
}

export interface CreateTerminalRequest {
    id_ciudad: string;
    nombre: string;
    direccion: string;
    telefono: string;
    hora_apertura: string;
    hora_cierre: string;
}

export interface UpdateTerminalRequest {
    id_ciudad?: string;
    nombre?: string;
    direccion?: string;
    telefono?: string;
    hora_apertura?: string;
    hora_cierre?: string;
}

export interface TerminalResponse {
    id_ciudad: string;
    nombre: string;
    direccion: string;
    telefono: string;
    hora_apertura: string;
    hora_cierre: string;
}
