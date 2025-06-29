// Servicio para reservas siguiendo principios SOLID
import { API_ENDPOINTS } from "../../../config/api";
import { Reserva } from "../domain/Reserva";

export class ReservaService {
    
    /**
     * Obtener todas las reservas
     */
    static async getAllReservas(): Promise<Reserva[]> {
        try {
            const response = await fetch(API_ENDPOINTS.RESERVAS.GET_ALL);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener reservas:', error);
            throw new Error('No se pudieron obtener las reservas');
        }
    }

    /**
     * Obtener reserva por ID
     */
    static async getReservaById(id: number): Promise<Reserva> {
        try {
            const response = await fetch(API_ENDPOINTS.RESERVAS.GET_BY_ID(id));
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener reserva:', error);
            throw new Error('No se pudo obtener la reserva');
        }
    }

    /**
     * Crear nueva reserva
     */
    static async createReserva(reservaData: Partial<Reserva>): Promise<Reserva> {
        try {
            console.log('🔍 ReservaService.createReserva - INICIO');
            console.log('  - reservaData recibida:', JSON.stringify(reservaData, null, 2));
            console.log('  - URL endpoint:', API_ENDPOINTS.RESERVAS.CREATE);
            
            console.log('🔍 ReservaService.createReserva - Haciendo petición fetch...');
            const response = await fetch(API_ENDPOINTS.RESERVAS.CREATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservaData),
            });
            
            console.log('🔍 ReservaService.createReserva - Response recibida:');
            console.log('  - status:', response.status);
            console.log('  - statusText:', response.statusText);
            console.log('  - ok:', response.ok);
            console.log('  - headers:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                console.log('🔍 ReservaService.createReserva - Response NO OK, obteniendo error...');
                // Intentar obtener el error del backend
                let errorMessage = `Error HTTP: ${response.status}`;
                try {
                    const errorData = await response.json();
                    console.log('🔍 ReservaService.createReserva - Error del backend:', JSON.stringify(errorData, null, 2));
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    console.log('🔍 ReservaService.createReserva - Error al parsear error del backend:', parseError);
                }
                throw new Error(errorMessage);
            }
            
            console.log('🔍 ReservaService.createReserva - Response OK, parseando resultado...');
            const result = await response.json();
            console.log('🔍 ReservaService.createReserva - Reserva creada exitosamente:', JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            console.error('🔍 ReservaService.createReserva - ERROR FINAL:');
            console.error('  - error completo:', error);
            console.error('  - error message:', (error as any)?.message);
            console.error('  - error stack:', (error as any)?.stack);
            throw new Error('No se pudo crear la reserva');
        }
    }

    /**
     * Actualizar reserva existente
     */
    static async updateReserva(id: number, reservaData: Partial<Reserva>): Promise<Reserva> {
        try {
            const response = await fetch(API_ENDPOINTS.RESERVAS.UPDATE(id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservaData),
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al actualizar reserva:', error);
            throw new Error('No se pudo actualizar la reserva');
        }
    }

    /**
     * Eliminar reserva
     */
    static async deleteReserva(id: number): Promise<void> {
        try {
            const response = await fetch(API_ENDPOINTS.RESERVAS.DELETE(id), {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
        } catch (error) {
            console.error('Error al eliminar reserva:', error);
            throw new Error('No se pudo eliminar la reserva');
        }
    }

    /**
     * Obtener reservas por usuario
     */
    static async getReservasByUser(userId: number): Promise<Reserva[]> {
        try {
            const response = await fetch(API_ENDPOINTS.RESERVAS.GET_BY_USER(userId));
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener reservas del usuario:', error);
            throw new Error('No se pudieron obtener las reservas del usuario');
        }
    }
}
