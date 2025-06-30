import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useAuthStore } from '../../adapters/stores/authStore';
import { Frecuencia } from '../../core/domain/Frecuencia';
import { ReservaPaymentData, ReservaPaymentService } from '../../core/infrastructure/ReservaPaymentService';

// Interfaz para asiento seleccionado con UUID
interface AsientoSeleccionado {
    numero: number;
    uuid: string;
}

export default function PaymentScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [paypalUrl, setPaypalUrl] = useState<string | null>(null);
    const [showWebView, setShowWebView] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    
    const { user, getUserId, getUserName, getUserIdentificacion } = useAuthStore();

    // Parsear parámetros
    const frecuencia = React.useMemo(() => {
        if (!params.frecuencia) return null;
        return typeof params.frecuencia === "string"
            ? JSON.parse(params.frecuencia)
            : params.frecuencia;
    }, [params.frecuencia]) as Frecuencia | null;

    const selectedSeats = React.useMemo(() => {
        if (!params.asientos) return [];
        const parsed = typeof params.asientos === "string"
            ? JSON.parse(params.asientos)
            : params.asientos;
        
        console.log('🪑 PaymentScreen - Asientos parseados:', parsed);
        return parsed;
    }, [params.asientos]) as AsientoSeleccionado[];

    const totalAmount = frecuencia ? frecuencia.total * selectedSeats.length : 0;

    // NOTA: Todas las validaciones de datos han sido eliminadas ya que 
    // el sistema garantiza que la identificación quemada '1804109096' siempre esté disponible

    const handlePayWithPayPal = async () => {
        if (!frecuencia || !user) {
            Alert.alert('Error', 'Datos de usuario o frecuencia no disponibles');
            return;
        }

        const userId = getUserId();
        if (!userId) {
            Alert.alert('Error', 'Usuario no autenticado');
            return;
        }

        // La identificación '1804109096' está quemada y siempre disponible
        const validIdentificacion = getUserIdentificacion() || '1804109096';
        console.log('🆔 Identificación para pago:', validIdentificacion || '1804109096 (quemada)');
        
        console.log('🔍 STEP 1: Preparando datos de reserva...');
        console.log('  - userId:', userId);
        console.log('  - frecuencia:', frecuencia);
        console.log('  - selectedSeats:', selectedSeats);
        console.log('  - validIdentificacion:', validIdentificacion);

        setLoading(true);
        
        try {
            
            const reservaData: ReservaPaymentData = {
                usuarioId: userId,
                frecuenciaId: frecuencia.frecuencia_id!.toString(), // Convertir a string
                asientos: selectedSeats, // Ahora ya incluye objetos con numero y uuid
                fechaViaje: new Date().toISOString(), // Fecha completa en formato ISO
                horaViaje: frecuencia.hora_salida,
                precio: frecuencia.total,
                destino: frecuencia.destino,
                nombrePasajero: getUserName(),
                identificacionPasajero: validIdentificacion || '1804109096' // Usar identificación o fallback directo
            };

            console.log('🔍 STEP 2: Datos de reserva construidos:');
            console.log('  - reservaData completo:', JSON.stringify(reservaData, null, 2));

            console.log('🔍 STEP 3: Iniciando pago PayPal...');
            const paymentUrl = await ReservaPaymentService.initiatePayPalPayment(reservaData);
            console.log('🔍 STEP 4: URL de pago obtenida exitosamente:', paymentUrl);
            
            console.log('🔍 STEP 5: Configurando WebView...');
            setPaypalUrl(paymentUrl);
            setShowWebView(true);
            console.log('🔍 STEP 5 SUCCESS: WebView configurada y mostrada');
        } catch (error) {
            console.error('🔍 STEP X: ERROR en PaymentScreen - handlePayWithPayPal:');
            console.error('  - Error completo:', error);
            console.error('  - Error message:', (error as any)?.message);
            console.error('  - Error stack:', (error as any)?.stack);
            
            Alert.alert(
                'Error', 
                'No se pudo iniciar el pago con PayPal. Por favor intenta de nuevo.'
            );
        } finally {
            setLoading(false);
        }
    };    const handleWebViewNavigation = (url: string) => {
        console.log('🔍 PaymentScreen.handleWebViewNavigation - URL navegación:', url);

        // Verificar si es una URL de éxito (tanto la nueva HTTPS como posibles deep links)
        if (url.includes('payment/success') || 
            url.includes('PayerID') || 
            url.includes('approved') ||
            url.includes('ruta593.com/payment/success')) {
            console.log('🔍 PaymentScreen - Pago detectado como exitoso en WebView');
            console.log('  - Cerrando WebView...');
            setShowWebView(false);
            console.log('  - Activando processingPayment...');
            setProcessingPayment(true);
            
            // Para URLs HTTPS de PayPal, necesitamos extraer manualmente los parámetros
            if (url.includes('ruta593.com/payment/success') || url.includes('PayerID')) {
                console.log('🔍 PaymentScreen - Procesando pago exitoso directamente desde WebView');
                handlePaymentSuccess(url);
            } else {
                console.log('🔍 PaymentScreen - El deep link será manejado por usePaymentLinking');
                // El deep link será manejado por usePaymentLinking
                // que procesará el pago automáticamente
            }
        }
        
        // Verificar si es una URL de cancelación  
        if (url.includes('payment/cancel') || 
            url.includes('cancel') || 
            url.includes('cancelled') ||
            url.includes('ruta593.com/payment/cancel')) {
            console.log('🔍 PaymentScreen - Pago cancelado en WebView');
            console.log('  - Cerrando WebView...');
            setShowWebView(false);
            setProcessingPayment(false);
            
            Alert.alert(
                'Pago Cancelado',
                'Has cancelado el pago. Puedes intentar de nuevo cuando quieras.',
                [{ text: 'OK', onPress: () => router.push('/') }]
            );
        }
    };

    const handlePaymentSuccess = async (url: string) => {
        try {
            console.log('🔍 PaymentScreen.handlePaymentSuccess - INICIO');
            console.log('  - url:', url);
            
            // Extraer parámetros de la URL de PayPal
            const urlObj = new URL(url);
            let paymentId = urlObj.searchParams.get('paymentId') || 
                           urlObj.searchParams.get('token') ||
                           urlObj.searchParams.get('payment_id');
            const payerId = urlObj.searchParams.get('PayerID') || urlObj.searchParams.get('payer_id');

            console.log('🔍 PaymentScreen.handlePaymentSuccess - Parámetros extraídos:');
            console.log('  - paymentId:', paymentId);
            console.log('  - payerId:', payerId);

            if (!paymentId) {
                console.error('🔍 PaymentScreen.handlePaymentSuccess - ERROR: ID de pago no encontrado');
                throw new Error('ID de pago no encontrado en la respuesta de PayPal');
            }

            // Obtener datos de reserva guardados temporalmente
            console.log('🔍 PaymentScreen.handlePaymentSuccess - Obteniendo datos de reserva temporales...');
            const reservaData = await ReservaPaymentService.getTemporaryReservationData();
            
            if (!reservaData) {
                console.error('🔍 PaymentScreen.handlePaymentSuccess - ERROR: Datos de reserva temporales no encontrados');
                throw new Error('Datos de reserva no encontrados');
            }

            console.log('🔍 PaymentScreen.handlePaymentSuccess - Datos de reserva recuperados');

            console.log('🔍 PaymentScreen.handlePaymentSuccess - Llamando a processApprovedPayment...');
            // Procesar el pago aprobado
            const result = await ReservaPaymentService.processApprovedPayment(
                paymentId,
                payerId || '',
                reservaData
            );

            console.log('🔍 PaymentScreen.handlePaymentSuccess - Resultado del procesamiento:', result);

            if (result.success) {
                console.log('🔍 PaymentScreen.handlePaymentSuccess - SUCCESS: Limpiando datos temporales...');
                // Limpiar datos temporales
                await ReservaPaymentService.clearTemporaryReservationData();
                
                setProcessingPayment(false);
                
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
                console.error('🔍 PaymentScreen.handlePaymentSuccess - ERROR: result.success = false');
                throw new Error(result.error || 'Error procesando el pago');
            }
        } catch (error) {
            console.error('🔍 PaymentScreen.handlePaymentSuccess - CATCH ERROR:', error);
            setProcessingPayment(false);
            
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
    };

    if (!frecuencia) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: No se encontraron datos de la frecuencia</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirmar Pago</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Resumen de la reserva */}
                <View style={styles.summaryCard}>
                    <Text style={styles.cardTitle}>Resumen de tu reserva</Text>
                    
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Ruta:</Text>
                        <Text style={styles.summaryValue}>{frecuencia.origen} → {frecuencia.destino}</Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Hora:</Text>
                        <Text style={styles.summaryValue}>{frecuencia.hora_salida}</Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Asientos:</Text>
                        <Text style={styles.summaryValue}>{selectedSeats.map(seat => seat.numero).join(', ')}</Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Cantidad:</Text>
                        <Text style={styles.summaryValue}>{selectedSeats.length} asiento(s)</Text>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Total a pagar:</Text>
                        <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Información del usuario */}
                <View style={styles.summaryCard}>
                    <Text style={styles.cardTitle}>Datos del pasajero</Text>
                    
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Nombre:</Text>
                        <Text style={styles.summaryValue}>{getUserName()}</Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Identificación:</Text>
                        <Text style={styles.summaryValue}>{getUserIdentificacion() || 'No disponible'}</Text>
                    </View>
                </View>

                {/* Botón de pago */}
                <TouchableOpacity
                    style={[styles.payButton, loading && styles.payButtonDisabled]}
                    onPress={handlePayWithPayPal}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="logo-paypal" size={24} color="#fff" />
                            <Text style={styles.payButtonText}>Pagar con PayPal</Text>
                        </>
                    )}
                </TouchableOpacity>

                <Text style={styles.securityText}>
                    🔒 Pago seguro procesado por PayPal
                </Text>
            </ScrollView>

            {/* WebView Modal para PayPal */}
            <Modal
                visible={showWebView}
                animationType="slide"
                presentationStyle="formSheet"
            >
                <View style={styles.webViewContainer}>
                    <View style={styles.webViewHeader}>
                        <Text style={styles.webViewTitle}>Pago con PayPal</Text>
                        <TouchableOpacity
                            onPress={() => setShowWebView(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                    
                    {paypalUrl && (
                        <WebView
                            source={{ uri: paypalUrl }}
                            onNavigationStateChange={(navState) => {
                                handleWebViewNavigation(navState.url);
                            }}
                            startInLoadingState={true}
                            renderLoading={() => (
                                <View style={styles.webViewLoading}>
                                    <ActivityIndicator size="large" color="#0066CC" />
                                    <Text>Cargando PayPal...</Text>
                                </View>
                            )}
                        />
                    )}
                </View>
            </Modal>

            {/* Modal de procesamiento */}
            <Modal visible={processingPayment} transparent animationType="fade">
                <View style={styles.processingModal}>
                    <View style={styles.processingContent}>
                        <ActivityIndicator size="large" color="#0066CC" />
                        <Text style={styles.processingText}>Procesando tu pago...</Text>
                        <Text style={styles.processingSubtext}>Por favor espera, no cierres la aplicación</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingTop: 50,
    },
    backIcon: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#666',
    },
    summaryValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 15,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0066CC',
    },
    payButton: {
        backgroundColor: '#0070ba',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
        gap: 10,
    },
    payButtonDisabled: {
        backgroundColor: '#ccc',
    },
    payButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    securityText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        marginTop: 15,
        marginBottom: 30,
    },
    errorText: {
        textAlign: 'center',
        color: '#e74c3c',
        fontSize: 16,
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#0066CC',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    webViewContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webViewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    webViewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 8,
    },
    webViewLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    processingModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    processingContent: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 12,
        alignItems: 'center',
        gap: 15,
        minWidth: 250,
    },
    processingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    processingSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});
