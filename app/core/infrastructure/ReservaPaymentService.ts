// Servicio para manejar el flujo completo de reserva y pago
// El backend ahora crea automáticamente el boleto cuando se confirma una reserva
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reserva } from '../domain/Reserva';
import { ComprobantePagoService } from './ComprobantePagoService';
import { PayPalService } from './PayPalService';
import { ReservaService } from './ReservaService';

export interface ReservaPaymentData {
    usuarioId: string;          // Cambiar de number a string para consistencia con API
    frecuenciaId: string;       // Cambiar de number a string para consistencia con API
    asientos: {numero: number, uuid: string}[]; // Ahora incluye UUID del asiento
    fechaViaje: string;
    horaViaje: string;
    precio: number;
    destino: string;
    nombrePasajero: string;
    identificacionPasajero: string;
    codigoDescuento?: string;   // Agregar soporte para códigos de descuento
}

export interface PaymentResult {
    success: boolean;
    reservaId?: number;
    boletoId?: number;
    transactionId?: string;
    qrUrl?: string;
    error?: string;
}

export class ReservaPaymentService {
    /**
     * Inicia el proceso de pago con PayPal
     */
    static async initiatePayPalPayment(reservaData: ReservaPaymentData): Promise<string> {
        try {
            console.log('🔍 ReservaPaymentService.initiatePayPalPayment - INICIO');
            console.log('  - reservaData recibida:', JSON.stringify(reservaData, null, 2));
            
            const totalAmount = reservaData.precio * reservaData.asientos.length;
            const description = `Ruta593 - ${reservaData.destino} - ${reservaData.asientos.length} asiento(s) (${reservaData.asientos.map(a => a.numero).join(', ')})`;
            
            console.log('🔍 ReservaPaymentService - Calculando datos de pago:');
            console.log('  - totalAmount:', totalAmount);
            console.log('  - description:', description);
            console.log('  - asientos con UUID:', reservaData.asientos);
            
            console.log('🔍 ReservaPaymentService - Llamando a PayPalService.createOrder...');
            const paymentUrl = await PayPalService.createOrder({
                amount: totalAmount,
                currency: 'USD',
                description: description,
                return_url: `home`,
                cancel_url: `ruta593movil://payment/cancel`
            });
            
            console.log('🔍 ReservaPaymentService - PayPal Order creada exitosamente, URL:', paymentUrl);

            // Guardar datos temporalmente para usar después del pago
            console.log('🔍 ReservaPaymentService - Guardando datos temporales...');
            await this.storeTemporaryReservationData(reservaData);
            console.log('🔍 ReservaPaymentService - Datos temporales guardados exitosamente');
            
            return paymentUrl;
        } catch (error) {
            console.error('🔍 ReservaPaymentService.initiatePayPalPayment - ERROR:');
            console.error('  - Error completo:', error);
            console.error('  - Error message:', (error as any)?.message);
            console.error('  - Error stack:', (error as any)?.stack);
            throw new Error('No se pudo iniciar el pago con PayPal');
        }
    }

    /**
     * Procesa el pago aprobado y completa la reserva
     * El backend creará automáticamente el boleto asociado
     */
    static async processApprovedPayment(
        paymentId: string, 
        payerId: string, 
        reservaData: ReservaPaymentData
    ): Promise<PaymentResult> {
        try {
            console.log('🔍 ReservaPaymentService.processApprovedPayment - INICIO');
            console.log('  - paymentId:', paymentId);
            console.log('  - payerId:', payerId);
            console.log('  - reservaData:', JSON.stringify(reservaData, null, 2));
            
            // 1. Capturar el pago en PayPal
            console.log('🔍 STEP 1: Capturando pago PayPal...');
            const captureResult = await PayPalService.captureOrder(paymentId);
            console.log('🔍 STEP 1 RESULT: captureResult:', captureResult);
            
            console.log('🔍 STEP 2: Validando estado del pago...');
            if (!PayPalService.validatePaymentStatus(captureResult)) {
                console.error('🔍 STEP 2 ERROR: El pago no fue completado exitosamente');
                throw new Error('El pago no fue completado exitosamente');
            }

            const paymentInfo = PayPalService.extractPaymentInfo(captureResult);
            console.log('🔍 STEP 2 SUCCESS: Pago capturado exitosamente:', paymentInfo);

            // 2. Crear las reservas con estado 'confirmada' - una por cada asiento
            // El backend creará automáticamente el boleto asociado
            console.log('🔍 STEP 3: Creando reservas confirmadas...');
            console.log('  - Número de asientos a procesar:', reservaData.asientos.length);
            const reservas = [];
            
            for (let i = 0; i < reservaData.asientos.length; i++) {
                const asiento = reservaData.asientos[i];
                console.log(`🔍 STEP 3.${i + 1}: Procesando asiento ${asiento.numero} (UUID: ${asiento.uuid})...`);
                
                const reservaDataItem: Partial<Reserva> = {
                    usuario_id: reservaData.usuarioId,
                    asiento_id: asiento.uuid, // Usar UUID del asiento
                    frecuencia_id: reservaData.frecuenciaId,
                    nombre_pasajero: reservaData.nombrePasajero,
                    metodo_pago: 'paypal',
                    identificacion_pasajero: reservaData.identificacionPasajero,
                    estado: 'confirmada', // Estado confirmada tras pago exitoso
                    fecha_viaje: reservaData.fechaViaje,
                    hora_viaje: reservaData.horaViaje,
                    precio: reservaData.precio,
                    destino_reserva: reservaData.destino,
                    codigo_descuento: reservaData.codigoDescuento || undefined
                };

                console.log(`🔍 STEP 3.${i + 1} DATA: reservaDataItem:`, JSON.stringify(reservaDataItem, null, 2));
                
                console.log(`🔍 STEP 3.${i + 1} CALL: Llamando a ReservaService.createReserva...`);
                const reserva = await ReservaService.createReserva(reservaDataItem);
                console.log(`🔍 STEP 3.${i + 1} SUCCESS: Reserva creada para asiento ${asiento.numero} (UUID: ${asiento.uuid}):`, reserva);
                
                reservas.push(reserva);
            }

            // 3. Crear comprobante de pago
            console.log('🔍 STEP 4: Creando comprobante de pago...');
            
            const comprobanteData = new FormData();
            comprobanteData.append('usuario_id', reservaData.usuarioId);
            comprobanteData.append('estado', 'aprobado');
            comprobanteData.append('comentarios', 
                `Pago procesado vía PayPal. TransID: ${paymentInfo.transactionId}. Email: ${paymentInfo.payerEmail || 'N/A'}. Reservas: ${reservas.map(r => r.reserva_id).join(', ')}`
            );
            
            // URL del recibo de PayPal
            const paypalReceiptUrl = `https://www.paypal.com/activity/payment/${paymentInfo.transactionId}`;
            comprobanteData.append('url_comprobante', paypalReceiptUrl);
            
            console.log('🔍 STEP 4 DATA: comprobanteData preparado');

            try {
                console.log('🔍 STEP 4 CALL: Llamando a ComprobantePagoService.createComprobante...');
                await ComprobantePagoService.createComprobante(comprobanteData);
                console.log('🔍 STEP 4 SUCCESS: Comprobante de pago creado exitosamente');
            } catch (comprobanteError) {
                console.warn('🔍 STEP 4 WARNING: Error creando comprobante, pero continuando:', comprobanteError);
                // No fallar todo el proceso si el comprobante falla
            }

            console.log('🔍 FINAL SUCCESS: Proceso de reserva completado exitosamente');
            console.log('  - Reservas creadas:', reservas.length);
            console.log('  - Primera reserva ID:', reservas[0].reserva_id);

            // Nota: El backend debe haber creado automáticamente el/los boleto(s)
            // asociado(s) a la(s) reserva(s) confirmada(s)
            return {
                success: true,
                reservaId: reservas[0].reserva_id,
                transactionId: paymentInfo.transactionId,
                // El boletoId y qrUrl serán obtenidos cuando el usuario consulte sus boletos
            };

        } catch (error) {
            console.error('🔍 FINAL ERROR: Error procesando pago aprobado:');
            console.error('  - error completo:', error);
            console.error('  - error message:', (error as any)?.message);
            console.error('  - error stack:', (error as any)?.stack);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido procesando el pago'
            };
        }
    }

    /**
     * Guarda temporalmente los datos de la reserva
     */
    private static async storeTemporaryReservationData(reservaData: ReservaPaymentData): Promise<void> {
        try {
            const tempData = {
                ...reservaData,
                timestamp: Date.now()
            };
            await AsyncStorage.setItem('temp_reservation', JSON.stringify(tempData));
        } catch (error) {
            console.warn('No se pudieron guardar los datos temporales:', error);
        }
    }

    /**
     * Recupera los datos temporales de la reserva
     */
    static async getTemporaryReservationData(): Promise<ReservaPaymentData | null> {
        try {
            const tempDataString = await AsyncStorage.getItem('temp_reservation');
            
            if (!tempDataString) {
                return null;
            }

            const tempData = JSON.parse(tempDataString);
            
            // Verificar que los datos no sean muy antiguos (1 hora máximo)
            if (Date.now() - tempData.timestamp > 3600000) {
                await AsyncStorage.removeItem('temp_reservation');
                return null;
            }

            return tempData;
        } catch (error) {
            console.warn('Error recuperando datos temporales:', error);
            return null;
        }
    }

    /**
     * Limpia los datos temporales
     */
    static async clearTemporaryReservationData(): Promise<void> {
        try {
            await AsyncStorage.removeItem('temp_reservation');
        } catch (error) {
            console.warn('Error limpiando datos temporales:', error);
        }
    }

    /**
     * Cancela una reserva y reintenta el reembolso si es posible
     */
    static async cancelReservation(reservaId: number): Promise<boolean> {
        try {
            // Actualizar estado de la reserva
            await ReservaService.updateReserva(reservaId, { estado: 'cancelada' });
            
            // En un entorno real, aquí se procesaría el reembolso
            console.log(`Reserva ${reservaId} cancelada`);
            
            return true;
        } catch (error) {
            console.error('Error cancelando reserva:', error);
            return false;
        }
    }
}
