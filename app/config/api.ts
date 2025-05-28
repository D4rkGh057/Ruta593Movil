// Configuración base de la API
export const API_BASE_URL = 'http://10.79.5.228:3000';

// Endpoints de la API
export const API_ENDPOINTS = {
    // Paradas
    PARADAS: {
        GET_ALL: `${API_BASE_URL}/api/paradas`,
        GET_BY_CIUDAD: (ciudad: string) => `${API_BASE_URL}/api/paradas/ciudad/${ciudad}`,
        BUSCAR: (ciudad: string) => `${API_BASE_URL}/api/paradas/buscar/${ciudad}`,
    },
    // Frecuencias
    FRECUENCIAS: {
        GET_BY_ORIGEN: (origen: string) => `${API_BASE_URL}/api/frecuencias/origen/${origen}`,
        GET_BY_DESTINO: (destino: string) => `${API_BASE_URL}/api/frecuencias/destino/${destino}`,
    },
    // Reservas
    RESERVAS: {
        CREATE: `${API_BASE_URL}/api/reserva`,
        GET_BY_USER: (userId: string) => `${API_BASE_URL}/api/reserva/usuario/${userId}`,
    },
    // Boletos
    BOLETOS: {
        CREATE: `${API_BASE_URL}/api/boletos`,
        GET_BY_USER: (userId: string) => `${API_BASE_URL}/api/boletos/usuario/${userId}`,
    }
}; 