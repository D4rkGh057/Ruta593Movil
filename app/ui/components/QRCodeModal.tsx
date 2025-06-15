import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QRCodeModalProps {
    visible: boolean;
    onClose: () => void;
    qrUrl: string;
    boletoInfo: {
        boletoId: number;
        asientos: string;
        fechaEmision: string;
        total: number;
    };
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
    visible,
    onClose,
    qrUrl,
    boletoInfo
}) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="formSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Código QR del Boleto</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.qrContainer}>
                        <Image 
                            source={{ uri: qrUrl }}
                            style={styles.qrImage}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>Información del Boleto</Text>
                        
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Boleto:</Text>
                            <Text style={styles.infoValue}>#{boletoInfo.boletoId}</Text>
                        </View>
                        
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Asientos:</Text>
                            <Text style={styles.infoValue}>{boletoInfo.asientos}</Text>
                        </View>
                        
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Fecha emisión:</Text>
                            <Text style={styles.infoValue}>{boletoInfo.fechaEmision}</Text>
                        </View>
                        
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Total:</Text>
                            <Text style={styles.infoValue}>${boletoInfo.total.toFixed(2)}</Text>
                        </View>
                    </View>

                    <View style={styles.instructionsCard}>
                        <Text style={styles.instructionsTitle}>Instrucciones</Text>
                        <Text style={styles.instructionsText}>
                            • Presenta este código QR al conductor al abordar
                        </Text>
                        <Text style={styles.instructionsText}>
                            • Llega 15 minutos antes de la salida
                        </Text>
                        <Text style={styles.instructionsText}>
                            • Mantén tu documento de identidad a mano
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    qrContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 30,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    qrImage: {
        width: 200,
        height: 200,
    },
    infoCard: {
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
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    instructionsCard: {
        backgroundColor: '#e8f4fd',
        borderRadius: 12,
        padding: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#0066CC',
    },
    instructionsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0066CC',
        marginBottom: 10,
    },
    instructionsText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        lineHeight: 20,
    },
});
