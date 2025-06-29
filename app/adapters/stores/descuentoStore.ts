import { Descuento } from '@/app/core/domain/Descuento';
import { DescuentoService } from '@/app/core/infrastructure/DescuentoService';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DescuentoStoreState {
    descuentos: Descuento[];
    selectedDescuento: Descuento | null;
    loading: boolean;
    error: string | null;
    
    // Acciones
    fetchDescuentos: () => Promise<void>;
    refreshDescuentos: () => Promise<void>; // Nueva función para forzar recarga desde API
    fetchDescuentoById: (id: string) => Promise<void>;
    createDescuento: (descuento: Omit<Descuento, 'descuento_id'>) => Promise<Descuento>;
    updateDescuento: (id: string, descuento: Partial<Descuento>) => Promise<Descuento>;
    deleteDescuento: (id: string) => Promise<void>;
    clearError: () => void;
    clearSelectedDescuento: () => void;
}

// Instancia del servicio
const descuentoService = new DescuentoService();

export const useDescuentoStore = create<DescuentoStoreState>()(
    persist(
        (set, get) => ({
            descuentos: [],
            selectedDescuento: null,
            loading: false,
            error: null,

            fetchDescuentos: async () => {
                // Si ya hay descuentos cargados, no los volvemos a cargar
                if (get().descuentos.length > 0 && !get().loading) {
                    return;
                }
                
                set({ loading: true, error: null });
                try {
                    const data = await descuentoService.getAllDescuentos();
                    set({ descuentos: data, loading: false });
                } catch (error) {
                    set({ 
                        error: error instanceof Error ? error.message : 'Error al cargar descuentos', 
                        loading: false 
                    });
                }
            },
            
            refreshDescuentos: async () => {
                // Esta función siempre recarga los datos desde la API
                set({ loading: true, error: null });
                try {
                    const data = await descuentoService.getAllDescuentos();
                    set({ descuentos: data, loading: false });
                    console.log('Descuentos recargados desde la API:', data.length);
                } catch (error) {
                    set({ 
                        error: error instanceof Error ? error.message : 'Error al recargar descuentos', 
                        loading: false 
                    });
                }
            },

            fetchDescuentoById: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    const data = await descuentoService.getDescuentoById(id);
                    set({ selectedDescuento: data, loading: false });
                    return data;
                } catch (error) {
                    set({ 
                        error: error instanceof Error ? error.message : `Error al cargar el descuento ${id}`, 
                        loading: false 
                    });
                    throw error;
                }
            },

            createDescuento: async (descuento: Omit<Descuento, 'descuento_id'>) => {
                set({ loading: true, error: null });
                try {
                    const nuevoDescuento = await descuentoService.createDescuento(descuento);
                    set(state => ({ 
                        descuentos: [...state.descuentos, nuevoDescuento],
                        loading: false 
                    }));
                    return nuevoDescuento;
                } catch (error) {
                    set({ 
                        error: error instanceof Error ? error.message : 'Error al crear el descuento', 
                        loading: false 
                    });
                    throw error;
                }
            },

            updateDescuento: async (id: string, descuento: Partial<Descuento>) => {
                set({ loading: true, error: null });
                try {
                    const descuentoActualizado = await descuentoService.updateDescuento(id, descuento);
                    set(state => ({ 
                        descuentos: state.descuentos.map(item => 
                            item.descuento_id === id ? descuentoActualizado : item
                        ),
                        selectedDescuento: state.selectedDescuento?.descuento_id === id 
                            ? descuentoActualizado 
                            : state.selectedDescuento,
                        loading: false 
                    }));
                    return descuentoActualizado;
                } catch (error) {
                    set({ 
                        error: error instanceof Error ? error.message : `Error al actualizar el descuento ${id}`, 
                        loading: false 
                    });
                    throw error;
                }
            },

            deleteDescuento: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    await descuentoService.deleteDescuento(id);
                    set(state => ({ 
                        descuentos: state.descuentos.filter(item => item.descuento_id !== id),
                        selectedDescuento: state.selectedDescuento?.descuento_id === id 
                            ? null 
                            : state.selectedDescuento,
                        loading: false 
                    }));
                } catch (error) {
                    set({ 
                        error: error instanceof Error ? error.message : `Error al eliminar el descuento ${id}`, 
                        loading: false 
                    });
                    throw error;
                }
            },

            clearError: () => set({ error: null }),
            
            clearSelectedDescuento: () => set({ selectedDescuento: null }),
        }),
        {
            name: 'descuento-storage',
            partialize: (state) => ({ 
                descuentos: state.descuentos,
                // No guardamos selectedDescuento, loading o error en almacenamiento persistente
            }),
        }
    )
);
