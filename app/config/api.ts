// Configuración base de la API
export const IP = '192.168.100.115';
export const API_BASE_URL = `http://${IP}:3000/api`;

// Endpoints de la API
export const API_ENDPOINTS = {
    // Paradas
    PARADAS: {
        GET_ALL: `${API_BASE_URL}/paradas`,
        GET_BY_CIUDAD: (ciudad: string) => `${API_BASE_URL}/paradas/ciudad/${ciudad}`,
        BUSCAR: (ciudad: string) => `${API_BASE_URL}/paradas/buscar/${ciudad}`,
    },
    // Frecuencias
    FRECUENCIAS: {
        GET_BY_ORIGEN: (origen: string) => `${API_BASE_URL}/frecuencias/origen/${origen}`,
        GET_BY_DESTINO: (destino: string) => `${API_BASE_URL}/frecuencias/destino/${destino}`,
    },
    // Reservas
    RESERVAS: {
        CREATE: `${API_BASE_URL}/reserva`,
        GET_BY_USER: (userId: string) => `${API_BASE_URL}/reserva/usuario/${userId}`,
    },
    // Boletos
    BOLETOS: {
        CREATE: `${API_BASE_URL}/boletos`,
        GET_BY_USER: (userId: string) => `${API_BASE_URL}/boletos/usuario/${userId}`,
    },
    // Cooperativas
    COOPERATIVAS: {
        CREATE: `${API_BASE_URL}/cooperativa`,
        GET_ALL: `${API_BASE_URL}/cooperativa`,
        GET_BY_ID: (id: number) => `${API_BASE_URL}/cooperativa/${id}`,
        UPDATE: (id: number) => `${API_BASE_URL}/cooperativa/${id}`,
        DELETE: (id: number) => `${API_BASE_URL}/cooperativa/${id}`,
    }
}; 