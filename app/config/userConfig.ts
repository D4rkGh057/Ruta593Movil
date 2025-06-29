// app/config/userConfig.ts

/**
 * Configuración de usuario específica
 * 
 * Este archivo contiene datos quemados del usuario para casos donde
 * la API no devuelve la información completa.
 */

export const USER_CONFIG = {
    // Identificación quemada para este usuario específico
    IDENTIFICACION_QUEMADA: '1804109096',
    
    // Otros datos que podrían necesitarse como fallback
    NOMBRE_FALLBACK: 'Usuario',
    APELLIDO_FALLBACK: 'Sistema',
    
    // Flag para activar/desactivar el uso de datos quemados
    USE_HARDCODED_DATA: true,
    
    // Logging de debugging
    DEBUG_MODE: true
} as const;

/**
 * Función para obtener la identificación con fallback
 */
export const getIdentificacionFallback = (): string => {
    return USER_CONFIG.IDENTIFICACION_QUEMADA;
};

/**
 * Función para verificar si se debe usar datos quemados
 */
export const shouldUseHardcodedData = (): boolean => {
    return USER_CONFIG.USE_HARDCODED_DATA;
};

/**
 * Función para logging condicional
 */
export const debugLog = (message: string, ...args: any[]): void => {
    if (USER_CONFIG.DEBUG_MODE) {
        console.log(`🔥 [HARDCODED] ${message}`, ...args);
    }
};

export default USER_CONFIG;
