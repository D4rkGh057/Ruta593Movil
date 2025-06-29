// app/hooks/useIdentificacion.ts
import { useEffect, useState } from 'react';
import { useAuthStore } from '../adapters/stores/authStore';
import SessionStorage from '../adapters/stores/SessionStorage';

/**
 * Hook personalizado para manejar la identificación del usuario
 * Proporciona acceso fácil a la identificación desde localStorage y estado
 */
export const useIdentificacion = () => {
    const [identificacionFromStorage, setIdentificacionFromStorage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    
    const { 
        getUserIdentificacion, 
        saveIdentificacionToStorage, 
        loadIdentificacionFromStorage,
        isAuthenticated 
    } = useAuthStore();

    // Cargar identificación desde localStorage al montar el componente
    useEffect(() => {
        const loadIdentificacion = async () => {
            try {
                setLoading(true);
                const identificacion = await loadIdentificacionFromStorage();
                setIdentificacionFromStorage(identificacion);
                console.log('🔍 useIdentificacion - Identificación cargada:', identificacion);
            } catch (error) {
                console.error('❌ useIdentificacion - Error al cargar identificación:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            loadIdentificacion();
        } else {
            setIdentificacionFromStorage(null);
            setLoading(false);
        }
    }, [isAuthenticated, loadIdentificacionFromStorage]);

    // Obtener identificación del estado actual o localStorage
    const getIdentificacion = (): string | null => {
        // Priorizar identificación del estado de usuario actual
        const stateIdentificacion = getUserIdentificacion();
        if (stateIdentificacion) {
            return stateIdentificacion;
        }
        
        // Fallback a identificación desde localStorage
        return identificacionFromStorage;
    };

    // Guardar identificación en localStorage
    const saveIdentificacion = async (identificacion: string): Promise<void> => {
        try {
            await saveIdentificacionToStorage(identificacion);
            setIdentificacionFromStorage(identificacion);
            console.log('✅ useIdentificacion - Identificación guardada:', identificacion);
        } catch (error) {
            console.error('❌ useIdentificacion - Error al guardar identificación:', error);
            throw error;
        }
    };

    // Limpiar identificación
    const clearIdentificacion = async (): Promise<void> => {
        try {
            await SessionStorage.clearIdentificacion();
            setIdentificacionFromStorage(null);
            console.log('🗑️ useIdentificacion - Identificación limpiada');
        } catch (error) {
            console.error('❌ useIdentificacion - Error al limpiar identificación:', error);
            throw error;
        }
    };

    // Verificar si el usuario tiene identificación
    const hasIdentificacion = (): boolean => {
        const identificacion = getIdentificacion();
        return identificacion !== null && identificacion.trim() !== '';
    };

    // Obtener identificación con validación
    const getValidIdentificacion = (): string | null => {
        const identificacion = getIdentificacion();
        if (identificacion && identificacion.trim() !== '') {
            return identificacion.trim();
        }
        return null;
    };

    return {
        // Estado
        identificacion: getIdentificacion(),
        identificacionFromStorage,
        loading,
        
        // Métodos
        getIdentificacion,
        getValidIdentificacion,
        saveIdentificacion,
        clearIdentificacion,
        hasIdentificacion,
        
        // Estado de validación
        isValid: hasIdentificacion(),
        isEmpty: !hasIdentificacion()
    };
};

export default useIdentificacion;
