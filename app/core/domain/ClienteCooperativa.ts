// Interfaces para el dominio de Cliente-Cooperativa
export interface ClienteCooperativa {
    id?: string;
    cooperativa_id: string;
    dni_cliente: string;
}

export interface CreateClienteCooperativaRequest {
    cooperativa_id: string;
    dni_cliente: string;
}

export interface UpdateClienteCooperativaRequest {
    cooperativa_id?: string;
    dni_cliente?: string;
}

export interface ClienteCooperativaResponse {
    cooperativa_id: string;
    dni_cliente: string;
}
