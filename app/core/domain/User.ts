export interface User {
    usuario_id?: string;
    identificacion: string;
    primer_nombre: string;
    segundo_nombre?: string;
    primer_apellido: string;
    segundo_apellido?: string;
    correo: string;
    password?: string;
    telefono?: string;
    direccion?: string;
    rol?: string;
    fecha_creacion?: string;
    activo?: boolean;
}

export interface CreateUserRequest {
    identificacion: string;
    primer_nombre: string;
    segundo_nombre?: string;
    primer_apellido: string;
    segundo_apellido?: string;
    correo: string;
    password: string;
    telefono?: string;
    direccion?: string;
}

export interface UpdateUserRequest {
    rol?: string;
    primer_nombre?: string;
    segundo_nombre?: string;
    primer_apellido?: string;
    segundo_apellido?: string;
    correo?: string;
    telefono?: string;
    direccion?: string;
}
