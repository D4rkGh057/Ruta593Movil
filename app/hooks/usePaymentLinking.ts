import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { ReservaPaymentService } from '../core/infrastructure/ReservaPaymentService';

export function usePaymentLinking() {
    const router = useRouter();

    useEffect(() => {
        const handleDeepLink = async (url: string) => {
            console.log('🔍 usePaymentLinking - Deep link recibido:', url);
            
            // Verificar si es un enlace de pago exitoso
            if (url.includes('payment/success') || url.includes('PayerID')) {
                try {
                    console.log('🔍 usePaymentLinking - Procesando pago desde deep link...');
                    
                    // Extraer parámetros de la URL
                    const urlObj = new URL(url);
                    let paymentId = urlObj.searchParams.get('paymentId') || 
                                   urlObj.searchParams.get('token') ||
                                   urlObj.searchParams.get('payment_id');
                    const payerId = urlObj.searchParams.get('PayerID') || urlObj.searchParams.get('payer_id');

                    console.log('🔍 usePaymentLinking - Parámetros extraídos:');
                    console.log('  - paymentId:', paymentId);
                    console.log('  - payerId:', payerId);
                    console.log('  - URL completa:', url);
                    console.log('  - URL searchParams:', Object.fromEntries(urlObj.searchParams.entries()));

                    if (!paymentId) {
                        console.error('🔍 usePaymentLinking - ERROR: ID de pago no encontrado');
                        throw new Error('ID de pago no encontrado en la respuesta de PayPal');
                    }

                    // Obtener datos de reserva guardados temporalmente
                    console.log('🔍 usePaymentLinking - Obteniendo datos de reserva temporales...');
                    const reservaData = await ReservaPaymentService.getTemporaryReservationData();
                    
                    if (!reservaData) {
                        console.error('🔍 usePaymentLinking - ERROR: Datos de reserva temporales no encontrados');
                        throw new Error('Datos de reserva no encontrados');
                    }

                    console.log('🔍 usePaymentLinking - Datos de reserva recuperados:', JSON.stringify(reservaData, null, 2));

                    console.log('🔍 usePaymentLinking - Llamando a processApprovedPayment...');
                    // Procesar el pago aprobado
                    const result = await ReservaPaymentService.processApprovedPayment(
                        paymentId,
                        payerId || '',
                        reservaData
                    );

                    console.log('🔍 usePaymentLinking - Resultado del procesamiento:', result);

                    if (result.success) {
                        console.log('🔍 usePaymentLinking - SUCCESS: Limpiando datos temporales...');
                        // Limpiar datos temporales
                        await ReservaPaymentService.clearTemporaryReservationData();
                        
                        console.log('Pago procesado exitosamente, navegando a boletos...');
                        
                        // Mostrar mensaje de éxito y navegar a boletos
                        Alert.alert(
                            '¡Pago Exitoso!',
                            `Tu reserva ha sido confirmada.\n\nReserva: #${result.reservaId}\nTransacción: ${result.transactionId}\n\nTu boleto se ha generado automáticamente.`,
                            [
                                {
                                    text: 'Ver Boletos',
                                    onPress: () => router.push('/(tabs)/boletos')
                                }
                            ]
                        );
                    } else {
                        console.error('🔍 usePaymentLinking - ERROR: result.success = false');
                        console.error('  - result completo:', result);
                        throw new Error(result.error || 'Error procesando el pago');
                    }
                } catch (error) {
                    console.error('🔍 usePaymentLinking - CATCH ERROR:');
                    console.error('  - error completo:', error);
                    console.error('  - error message:', (error as any)?.message);
                    console.error('  - error stack:', (error as any)?.stack);
                    
                    Alert.alert(
                        'Error',
                        `Hubo un problema procesando tu pago: ${error instanceof Error ? error.message : 'Error desconocido'}.\n\nPor favor contacta con soporte si el dinero fue descontado.`,
                        [
                            {
                                text: 'Ir a Inicio',
                                onPress: () => router.push('/')
                            }
                        ]
                    );
                }
            } else if (url.includes('payment/cancel')) {
                console.log('Pago cancelado desde deep link');
                Alert.alert(
                    'Pago Cancelado',
                    'Has cancelado el pago. Puedes intentar de nuevo cuando quieras.',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.push('/')
                        }
                    ]
                );
            }
        };

        // Escuchar enlaces cuando la app está abierta
        const subscription = Linking.addEventListener('url', (event: any) => {
            handleDeepLink(event.url);
        });

        // Verificar si la app se abrió con un enlace
        Linking.getInitialURL().then((url: string | null) => {
            if (url) {
                handleDeepLink(url);
            }
        });

        return () => subscription?.remove();
    }, [router]);
}

export default usePaymentLinking;
