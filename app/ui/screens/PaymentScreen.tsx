import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Modal,
    ScrollView
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ReservaPaymentService, ReservaPaymentData } from '../../core/infrastructure/ReservaPaymentService';
import { useAuthStore } from '../../adapters/stores/authStore';
import { Frecuencia } from '../../core/domain/Frecuencia';

export default function PaymentScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [paypalUrl, setPaypalUrl] = useState<string | null>(null);
    const [showWebView, setShowWebView] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    
    const { user, getUserId, getUserName } = useAuthStore();

    // Parsear parámetros
    const frecuencia = React.useMemo(() => {
        if (!params.frecuencia) return null;
        return typeof params.frecuencia === "string"
            ? JSON.parse(params.frecuencia)
            : params.frecuencia;
    }, [params.frecuencia]) as Frecuencia | null;

    const selectedSeats = React.useMemo(() => {
        if (!params.asientos) return [];
        return typeof params.asientos === "string"
            ? JSON.parse(params.asientos)
            : params.asientos;
    }, [params.asientos]) as number[];

    const totalAmount = frecuencia ? frecuencia.total * selectedSeats.length : 0;

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

        setLoading(true);
        
        try {            const reservaData: ReservaPaymentData = {
                usuarioId: userId,
                frecuenciaId: frecuencia.frecuencia_id!,
                asientos: selectedSeats,
                fechaViaje: new Date().toISOString().split('T')[0], // Fecha actual por defecto
                horaViaje: frecuencia.hora_salida,
                precio: frecuencia.total,
                destino: frecuencia.destino,
                nombrePasajero: getUserName(),
                identificacionPasajero: user.identificacion || ''
            };

            console.log('Iniciando pago PayPal con datos:', reservaData);
            
            const paymentUrl = await ReservaPaymentService.initiatePayPalPayment(reservaData);
            console.log('URL de pago obtenida:', paymentUrl);
            
            setPaypalUrl(paymentUrl);
            setShowWebView(true);
        } catch (error) {
            console.error('Error iniciando pago:', error);
            Alert.alert(
                'Error', 
                'No se pudo iniciar el pago con PayPal. Por favor intenta de nuevo.'
            );
        } finally {
            setLoading(false);
        }
    };    const handleWebViewNavigation = async (url: string) => {
        console.log('WebView navegando a:', url);

        // Verificar si es una URL de éxito
        if (url.includes('payment/success') || url.includes('PayerID') || url.includes('approved')) {
            console.log('Pago aprobado, procesando...');
            setProcessingPayment(true);
            setShowWebView(false);

            try {
                // Extraer parámetros de la URL de diferentes formas posibles
                const urlObj = new URL(url);
                let paymentId = urlObj.searchParams.get('paymentId') || 
                               urlObj.searchParams.get('token') ||
                               urlObj.searchParams.get('payment_id');
                const payerId = urlObj.searchParams.get('PayerID') || urlObj.searchParams.get('payer_id');

                // Si no encontramos los parámetros en query string, intentar extraer del hash o path
                if (!paymentId && url.includes('#')) {
                    const hashParams = new URLSearchParams(url.split('#')[1]);
                    paymentId = hashParams.get('paymentId') || hashParams.get('token');
                }

                console.log('PaymentId extraído:', paymentId, 'PayerId:', payerId);

                if (!paymentId) {
                    throw new Error('ID de pago no encontrado en la respuesta de PayPal');
                }

                // Obtener datos de reserva guardados temporalmente
                const reservaData = await ReservaPaymentService.getTemporaryReservationData();
                
                if (!reservaData) {
                    throw new Error('Datos de reserva no encontrados');
                }

                console.log('Procesando pago con datos:', { paymentId, payerId, reservaData });

                // Procesar el pago aprobado
                const result = await ReservaPaymentService.processApprovedPayment(
                    paymentId,
                    payerId || '',
                    reservaData
                );

                if (result.success) {
                    // Limpiar datos temporales
                    await ReservaPaymentService.clearTemporaryReservationData();
                    
                    Alert.alert(
                        '¡Pago Exitoso!',
                        `Tu reserva ha sido confirmada.\n\nBoleto: #${result.boletoId}\nTransacción: ${result.transactionId}\n\nPuedes ver tu boleto y código QR en la sección "Mis Boletos".`,
                        [
                            {
                                text: 'Ver Boletos',
                                onPress: () => router.push('/(tabs)/boletos')
                            }
                        ]
                    );
                } else {
                    throw new Error(result.error || 'Error procesando el pago');
                }
            } catch (error) {
                console.error('Error procesando pago aprobado:', error);
                Alert.alert(
                    'Error',
                    `Hubo un problema procesando tu pago: ${error instanceof Error ? error.message : 'Error desconocido'}.\n\nPor favor contacta con soporte si el dinero fue descontado.`,
                    [
                        {
                            text: 'Reintentar',
                            onPress: () => {
                                setProcessingPayment(false);
                                // Permitir al usuario intentar de nuevo
                            }
                        },
                        {
                            text: 'Volver',
                            onPress: () => router.back(),
                            style: 'cancel'
                        }
                    ]
                );
            } finally {
                setProcessingPayment(false);
            }
        }
        
        // Verificar si es una URL de cancelación
        if (url.includes('payment/cancel') || url.includes('cancel') || url.includes('cancelled')) {
            console.log('Pago cancelado por el usuario');
            setShowWebView(false);
            Alert.alert(
                'Pago Cancelado',
                'Has cancelado el pago. Puedes intentar de nuevo cuando quieras.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
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
                        <Text style={styles.summaryValue}>{selectedSeats.join(', ')}</Text>
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
                        <Text style={styles.summaryValue}>{user?.identificacion || 'No disponible'}</Text>
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
