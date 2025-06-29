export interface Reserva {
    reserva_id: number;
    usuario_id: string;              // Cambiado a string para coincidir con API
    asiento_id: string;              // Cambiado a string para coincidir con API
    frecuencia_id: string;           // Cambiado a string para coincidir con API
    boleto_id?: number;              // Opcional porque el backend lo crea automáticamente
    nombre_pasajero: string;
    metodo_pago: string;
    identificacion_pasajero: string;
    estado: string;
    fecha_viaje: string;
    hora_viaje: string;
    precio: number;
    destino_reserva: string;
    codigo_descuento?: string;       // Agregado campo opcional para descuentos
    fecha_creacion?: string;
    usuario?: any;
    asiento?: any;
    frecuencia?: any;
    boleto?: any;
}

// Interface para crear reservas
export interface CreateReservaRequest {
    usuario_id: string;
    asiento_id: string;
    frecuencia_id: string;
    nombre_pasajero: string;
    metodo_pago: string;
    identificacion_pasajero: string;
    estado: string;
    fecha_viaje: string;
    hora_viaje: string;
    precio: number;
    destino_reserva: string;
    codigo_descuento?: string;
}

// Interface para actualizar reservas
export interface UpdateReservaRequest {
    usuario_id?: string;
    asiento_id?: string;
    frecuencia_id?: string;
    nombre_pasajero?: string;
    metodo_pago?: string;
    identificacion_pasajero?: string;
    estado?: string;
    fecha_viaje?: string;
    hora_viaje?: string;
    precio?: number;
    destino_reserva?: string;
    codigo_descuento?: string;
}
