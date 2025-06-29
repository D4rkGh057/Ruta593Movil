export interface Descuento {
    descuento_id?: string;
    nombre: string;
    porcentaje: number | string;
    vida_util: string;
    link_descarga?: string;
    codigo_promocional: string;
    mensaje: string;
    activo: boolean;
}

export interface DescuentoCreate {
    nombre: string;
    porcentaje: number;
    vida_util: string;
    link_descarga?: string;
    codigo_promocional: string;
    mensaje: string;
    activo: boolean;
}
