import { useDescuentoStore } from '@/app/adapters/stores/descuentoStore';
import { Descuento } from '@/app/core/domain/Descuento';
import { useEffect } from 'react';

interface UseDescuentosReturn {
    descuentos: Descuento[];
    selectedDescuento: Descuento | null;
    loading: boolean;
    error: string | null;
    getDescuentos: () => Promise<void>;
    refreshDescuentos: () => Promise<void>; // Nueva función para forzar recarga desde API
    getDescuentoById: (id: string) => Promise<void>;
    createDescuento: (descuento: Omit<Descuento, 'descuento_id'>) => Promise<Descuento>;
    updateDescuento: (id: string, descuento: Partial<Descuento>) => Promise<Descuento>;
    deleteDescuento: (id: string) => Promise<void>;
    clearError: () => void;
    clearSelectedDescuento: () => void;
}

export const useDescuentos = (autoload = true): UseDescuentosReturn => {
    const {
        descuentos,
        selectedDescuento,
        loading,
        error,
        fetchDescuentos,
        refreshDescuentos,
        fetchDescuentoById,
        createDescuento,
        updateDescuento,
        deleteDescuento,
        clearError,
        clearSelectedDescuento
    } = useDescuentoStore();

    // Cargar descuentos automáticamente si autoload es true
    useEffect(() => {
        if (autoload && descuentos.length === 0 && !loading) {
            fetchDescuentos();
        }
    }, [autoload, descuentos.length, loading, fetchDescuentos]);

    return {
        descuentos,
        selectedDescuento,
        loading,
        error,
        getDescuentos: fetchDescuentos,
        refreshDescuentos,
        getDescuentoById: fetchDescuentoById,
        createDescuento,
        updateDescuento,
        deleteDescuento,
        clearError,
        clearSelectedDescuento
    };
};
