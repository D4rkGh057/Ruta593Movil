// Interfaces para el dominio de Estructura de Bus
export interface EstructuraBus {
    id?: string;
    nombre: string;
    distribucion: string;
    id_cooperativa: number;
}

export interface CreateEstructuraBusRequest {
    nombre: string;
    distribucion: string;
    id_cooperativa: number;
}

export interface UpdateEstructuraBusRequest {
    nombre?: string;
    distribucion?: string;
    id_cooperativa?: number;
}

export interface EstructuraBusResponse {
    nombre: string;
    distribucion: string;
    id_cooperativa: number;
}

export interface AsientoConfig {
    numero: number;
    tipo: 'normal' | 'vip';
    disponible: boolean;
    fila: number;
    columna: number;
}

export interface DistribucionBus {
    filas: number;
    asientosPorFila: number;
    pasillo: number[]; // Posiciones donde va el pasillo
    asientos: AsientoConfig[];
    totalAsientos: number;
}

// Función para parsear la distribución del bus
export const parseDistribucionBus = (distribucionStr: string): DistribucionBus | null => {
    try {
        const distribucion = JSON.parse(distribucionStr);
        return distribucion;
    } catch (error) {
        console.error('Error parseando distribución del bus:', error);
        return null;
    }
};

// Función para crear distribución por defecto si no viene desde el backend
export const createDefaultDistribution = (totalSeats: number): DistribucionBus => {
    const asientos: AsientoConfig[] = [];
    const filas = Math.ceil(totalSeats / 4);
    
    for (let i = 1; i <= totalSeats; i++) {
        const fila = Math.floor((i - 1) / 4);
        const columna = (i - 1) % 4;
        
        asientos.push({
            numero: i,
            tipo: 'normal',
            disponible: true,
            fila,
            columna
        });
    }
    
    return {
        filas,
        asientosPorFila: 4,
        pasillo: [2], // Pasillo después de la columna 1 (entre asientos 2 y 3)
        asientos,
        totalAsientos: totalSeats
    };
};
