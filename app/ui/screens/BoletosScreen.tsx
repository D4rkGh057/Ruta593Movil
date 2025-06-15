import { Ionicons } from "@expo/vector-icons";
import "nativewind";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Boleto } from "../../core/domain/Boleto";
import { BoletoService } from "../../core/infrastructure/BoletoService";
import { useAuthStore } from "../../adapters/stores/authStore";
import { QRCodeModal } from "../components/QRCodeModal";

export default function BoletosScreen() {
    const [boletos, setBoletos] = useState<Boleto[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedBoleto, setSelectedBoleto] = useState<Boleto | null>(null);
    const [showQRModal, setShowQRModal] = useState(false);
    
    const { getUserId } = useAuthStore();

    const fetchBoletos = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        else setLoading(true);
        
        try {
            const userId = getUserId();
            let data;
            
            if (userId) {
                // Obtener boletos del usuario específico
                data = await BoletoService.getBoletosByUser(userId.toString());
            } else {
                // Si no hay usuario, obtener todos (fallback)
                data = await BoletoService.getAllBoletos();
            }
            
            setBoletos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching boletos:", error);
            setBoletos([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBoletos();
    }, []);

    const onRefresh = () => {
        fetchBoletos(true);
    };

    const handleShowQR = (boleto: Boleto) => {
        setSelectedBoleto(boleto);
        setShowQRModal(true);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No disponible';
        return new Date(dateString).toLocaleDateString('es-EC', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>Cargando boletos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Mis Boletos</Text>
                    <Text style={styles.headerSubtitle}>
                        {boletos.length} boleto{boletos.length !== 1 ? 's' : ''}
                    </Text>
                </View>

                {boletos.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="ticket-outline" size={80} color="#ccc" />
                        <Text style={styles.emptyTitle}>No tienes boletos</Text>
                        <Text style={styles.emptySubtitle}>
                            Cuando compres un boleto, aparecerá aquí
                        </Text>
                    </View>
                ) : (
                    <View style={styles.boletosList}>
                        {boletos.map((boleto) => (
                            <View key={boleto.boleto_id} style={styles.boletoCard}>
                                {/* Header del boleto */}
                                <View style={styles.boletoHeader}>
                                    <View>
                                        <Text style={styles.boletoId}>
                                            Boleto #{boleto.boleto_id}
                                        </Text>
                                        <Text style={styles.boletoDate}>
                                            {formatDate(boleto.fecha_emision)}
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.statusBadge,
                                        boleto.estado === 'activo' ? styles.statusActive : styles.statusInactive
                                    ]}>
                                        <Text style={[
                                            styles.statusText,
                                            boleto.estado === 'activo' ? styles.statusActiveText : styles.statusInactiveText
                                        ]}>
                                            {boleto.estado?.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                                {/* Información del boleto */}
                                <View style={styles.boletoInfo}>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="people-outline" size={16} color="#666" />
                                        <Text style={styles.infoText}>
                                            {boleto.cantidad_asientos} asiento{boleto.cantidad_asientos !== 1 ? 's' : ''}
                                        </Text>
                                    </View>
                                    
                                    <View style={styles.infoRow}>
                                        <Ionicons name="car-outline" size={16} color="#666" />
                                        <Text style={styles.infoText}>
                                            Asientos: {boleto.asientos}
                                        </Text>
                                    </View>
                                    
                                    <View style={styles.infoRow}>
                                        <Ionicons name="cash-outline" size={16} color="#666" />
                                        <Text style={styles.infoText}>
                                            Total: ${boleto.total.toFixed(2)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Acciones del boleto */}
                                <View style={styles.boletoActions}>
                                    {boleto.url_imagen_qr && (
                                        <TouchableOpacity
                                            style={styles.qrButton}
                                            onPress={() => handleShowQR(boleto)}
                                        >
                                            <Ionicons name="qr-code-outline" size={20} color="#0066CC" />
                                            <Text style={styles.qrButtonText}>Ver QR</Text>
                                        </TouchableOpacity>
                                    )}
                                    
                                    <View style={styles.actionsSpacer} />
                                    
                                    <TouchableOpacity style={styles.detailsButton}>
                                        <Text style={styles.detailsButtonText}>Detalles</Text>
                                        <Ionicons name="chevron-forward" size={16} color="#666" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Modal del código QR */}
            {selectedBoleto && (
                <QRCodeModal
                    visible={showQRModal}
                    onClose={() => {
                        setShowQRModal(false);
                        setSelectedBoleto(null);
                    }}
                    qrUrl={selectedBoleto.url_imagen_qr}
                    boletoInfo={{
                        boletoId: selectedBoleto.boleto_id!,
                        asientos: selectedBoleto.asientos,
                        fechaEmision: formatDate(selectedBoleto.fecha_emision),
                        total: selectedBoleto.total
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    boletosList: {
        padding: 20,
    },
    boletoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    boletoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    boletoId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    boletoDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusActive: {
        backgroundColor: '#e8f5e8',
    },
    statusInactive: {
        backgroundColor: '#fff3cd',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    statusActiveText: {
        color: '#28a745',
    },
    statusInactiveText: {
        color: '#856404',
    },
    boletoInfo: {
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
    },
    boletoActions: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 16,
    },
    qrButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f4fd',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    qrButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#0066CC',
    },
    actionsSpacer: {
        flex: 1,
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailsButtonText: {
        fontSize: 12,
        color: '#666',
    },
});
