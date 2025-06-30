import { Descuento } from "../core/domain/Descuento";

export const NOVEDADES_MOCK = [
    {
        id: 1,
        title: "Días suaves de ruta593",
        subtitle: "¡Descuentos increíbles en cada ruta, todo el tiempo!",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Viaja Seguro",
        subtitle: "Todas nuestras unidades cuentan con GPS y monitoreo en tiempo real",
        image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=1000&auto=format&fit=crop",
    },
];

export const OFERTAS_MOCK: Descuento[] = [
    {
        descuento_id: "1",
        nombre: "Quito - Guayaquil 25% OFF",
        porcentaje: 25,
        vida_util: "31 may",
        link_descarga: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=400&auto=format&fit=crop",
        codigo_promocional: "QUITO25",
        mensaje: "¡Descuento especial para la ruta más popular!",
        activo: true,
    },
    {
        descuento_id: "2",
        nombre: "Cuenca - Loja desde $12",
        porcentaje: 30,
        vida_util: "15 jun",
        link_descarga: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=400&auto=format&fit=crop",
        codigo_promocional: "CUENCA30",
        mensaje: "Viaja cómodo y ahorra en esta ruta destacada",
        activo: true,
    },
    {
        descuento_id: "3",
        nombre: "Ambato - Riobamba 2x1",
        porcentaje: 50,
        vida_util: "31 dic",
        link_descarga: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=400&auto=format&fit=crop",
        codigo_promocional: "AMBATO2X1",
        mensaje: "¡Oferta especial! Compra un boleto y lleva otro gratis",
        activo: true,
    },
];
