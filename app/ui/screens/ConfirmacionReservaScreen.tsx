import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Frecuencia } from "../../core/domain/Frecuencia";
import { ReservaService } from "../../core/infrastructure/ReservaService";
import { BusSeats } from "../components/BusSeats";

const { height: screenHeight } = Dimensions.get("window");

// Componente de Modal Bottom Sheet
const InfoModal = ({
    visible,
    onClose,
    frecuencia,
}: {
    visible: boolean;
    onClose: () => void;
    frecuencia: Frecuencia | null;
}) => {
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHandle} />
                        <Text style={styles.modalTitle}>Información del viaje</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Detalles del viaje</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Origen</Text>
                                <Text style={styles.infoValue}>{frecuencia?.origen || "N/A"}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Destino</Text>
                                <Text style={styles.infoValue}>{frecuencia?.destino || "N/A"}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Fecha</Text>
                                <Text style={styles.infoValue}>
                                    {frecuencia?.fecha_creacion || "N/A"}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Hora de salida</Text>
                                <Text style={styles.infoValue}>
                                    {frecuencia?.hora_salida || "N/A"}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Precio y servicios</Text>
                            <View style={styles.priceCard}>
                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>Precio por asiento</Text>
                                    <Text style={styles.priceValue}>COP 170.000</Text>
                                </View>
                            </View>
                            <Text style={styles.servicesTitle}>Servicios incluidos:</Text>
                            <View style={styles.servicesList}>
                                <View style={styles.serviceItem}>
                                    <Ionicons name="wifi" size={20} color="#0066CC" />
                                    <Text style={styles.serviceText}>WiFi gratuito</Text>
                                </View>
                                <View style={styles.serviceItem}>
                                    <Ionicons name="snow" size={20} color="#0066CC" />
                                    <Text style={styles.serviceText}>Aire acondicionado</Text>
                                </View>
                                <View style={styles.serviceItem}>
                                    <Ionicons name="body" size={20} color="#0066CC" />
                                    <Text style={styles.serviceText}>Baño a bordo</Text>
                                </View>
                                <View style={styles.serviceItem}>
                                    <Ionicons name="tv" size={20} color="#0066CC" />
                                    <Text style={styles.serviceText}>Entretenimiento</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Información importante</Text>
                            <Text style={styles.infoText}>
                                • Llegue 30 minutos antes de la salida
                            </Text>
                            <Text style={styles.infoText}>
                                • Presente su documento de identidad
                            </Text>
                            <Text style={styles.infoText}>
                                • Máximo 2 equipajes de mano por persona
                            </Text>
                            <Text style={styles.infoText}>
                                • Cancelación gratuita hasta 2 horas antes
                            </Text>
                        </View>
                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Política de cancelación</Text>
                            <View style={styles.policyTable}>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.tableHeaderText}>
                                        Tiempo antes del viaje
                                    </Text>
                                    <Text style={styles.tableHeaderText}>Cantidad devuelta</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>1 hora(s) antes del viaje</Text>
                                    <Text style={styles.tableCell}>136000 COP</Text>
                                </View>
                            </View>
                            <Text style={styles.policyNote}>
                                Los cargos de cancelación se calculan en función de la fecha de
                                inicio del servicio: 18-04-2025 13:00
                            </Text>
                            <Text style={styles.policyNote}>
                                Los gastos de cancelación se calculan por asiento. La tarifa de
                                cancelación anterior se calcula en función de la tarifa por asiento
                                de 170000.000000
                            </Text>
                            <Text style={styles.policyNote}>
                                El ticket no puede cancelarse después de la hora de salida
                                programada del autobús desde el primer punto de embarque
                            </Text>
                        </View>
                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Otras políticas</Text>

                            <View style={styles.policyItem}>
                                <Text style={styles.policyTitle}>Políticas de equipaje</Text>
                                <Text style={styles.policyDescription}>
                                    Los pasajeros pueden llevar un bolso de mano/bolso de hombro y/o
                                    equipaje principal con un peso máximo de 20 kilos. Cualquier
                                    peso de equipaje adicional deb...
                                </Text>
                                <Text style={styles.seeMore}>Ver más</Text>
                            </View>

                            <View style={styles.policyItem}>
                                <Text style={styles.policyTitle}>Política de menores</Text>
                                <Text style={styles.policyDescription}>
                                    En cumplimiento de la circular externa No. 101440000000057 del
                                    20 de agosto de 2024, los menores de edad deben comprar un
                                    tiquete, ocupar una ...
                                </Text>
                                <Text style={styles.seeMore}>Ver más</Text>
                            </View>

                            <View style={styles.policyItem}>
                                <Text style={styles.policyTitle}>Política de mascotas</Text>
                                <Text style={styles.policyDescription}>
                                    Las mascotas están permitidas
                                </Text>
                                <Text style={styles.policyDescription}>
                                    Solo se permiten 1 mascotas domesticadas
                                </Text>
                            </View>
                            <View style={styles.policyItem}>
                                <Text style={styles.policyTitle}>Política de embarque</Text>
                                <Text style={styles.policyDescription}>
                                    El operador del autobús no está obligado a esperar más allá de
                                    la hora de salida programada del autobús. Si BOD puede permitir
                                    el reembolso de su boleto o el bloeto puede ...
                                </Text>
                                <Text style={styles.seeMore}>Leer más</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export function ConfirmacionReservaScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [reservedSeats, setReservedSeats] = useState<number[]>([]);
    const [showInfoModal, setShowInfoModal] = useState(false);

    const frecuencia = React.useMemo(() => {
        if (!params.frecuencia) return null;
        return typeof params.frecuencia === "string"
            ? JSON.parse(params.frecuencia)
            : params.frecuencia;
    }, [params.frecuencia]);
    useEffect(() => {
        const fetchReservedSeats = async () => {
            try {
                // Obtener todas las reservas para verificar asientos ocupados
                const data = await ReservaService.getAllReservas();

                // Verificar que data es un array y tiene la estructura esperada
                if (Array.isArray(data)) {
                    const reservedSeatNumbers = data
                        .filter(
                            (reserva) =>
                                reserva &&
                                reserva.frecuencia_id === frecuencia?.frecuencia_id &&
                                typeof reserva.numero_asiento === "number"
                        )
                        .map((reserva) => reserva.numero_asiento);
                    setReservedSeats(reservedSeatNumbers);
                } else {
                    // Si no es un array, inicializar con asientos de ejemplo para pruebas
                    // En producción, esto debería ser un array vacío
                    setReservedSeats([3, 4, 15, 16]); // Asientos de ejemplo como reservados
                }
            } catch (error) {
                console.error("Error fetching reserved seats:", error);
                // Para propósitos de prueba, establecer algunos asientos como reservados
                // En producción, esto debería ser un array vacío
                setReservedSeats([3, 4, 15, 16]); // Asientos de ejemplo como reservados
            }
        };

        if (frecuencia?.frecuencia_id) {
            fetchReservedSeats();
        } else {
            setReservedSeats([]);
        }
    }, [frecuencia]);

    const handleSeatSelect = (seatNumber: number) => {
        setSelectedSeats((prev) => {
            if (prev.includes(seatNumber)) {
                return prev.filter((num) => num !== seatNumber);
            }
            return [...prev, seatNumber];
        });
    };
    if (!frecuencia) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <Text style={styles.title}>Error</Text>
                <Text style={styles.errorText}>No se encontraron datos del bus</Text>
                <TouchableOpacity style={styles.continueButton} onPress={() => router.back()}>
                    <Text style={styles.continueButtonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }
    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                    <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Selección de asientos</Text>
                <Text style={styles.routeText}>
                    {frecuencia?.origen} → {frecuencia?.destino}
                </Text>
                {/* Botón para abrir información del viaje */}
                <TouchableOpacity style={styles.infoButton} onPress={() => setShowInfoModal(true)}>
                    <Ionicons name="information-circle-outline" size={24} color="#0066CC" />
                    <Text style={styles.infoButtonText}>Ver información del viaje</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
                {/* 
                
                <View style={styles.promoBanner}>
                    <View style={styles.promoTextContainer}>
                        <Text style={styles.promoLabel}>AHORRA</Text>
                        <Text style={styles.promoDescription}>Extra hasta un 15% dto</Text>
                    </View>
                    <TouchableOpacity style={styles.copyButton}>
                        <Text style={styles.copyButtonText}>Copiar</Text>
                    </TouchableOpacity>
                </View>
                
                */}
                <BusSeats
                    totalSeats={40}
                    reservedSeats={reservedSeats}
                    selectedSeats={selectedSeats}
                    onSeatSelect={handleSeatSelect}
                />
                {selectedSeats.length > 0 && (
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={() => {
                            router.push({
                                pathname: "/boletos",
                                params: {
                                    frecuencia: JSON.stringify(frecuencia),
                                    asientos: JSON.stringify(selectedSeats),
                                },
                            });
                        }}
                    >
                        <Text style={styles.continueButtonText}>
                            Continuar con la reserva ({selectedSeats.length} asientos)
                        </Text>
                    </TouchableOpacity>
                )}
                {/* Modal de información */}
                <InfoModal
                    visible={showInfoModal}
                    onClose={() => setShowInfoModal(false)}
                    frecuencia={frecuencia}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        padding: 20,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    backButtonText: {
        marginLeft: 10,
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    routeText: {
        fontSize: 18,
        color: "#666",
        marginBottom: 20,
    },
    promoBanner: {
        flexDirection: "row",
        backgroundColor: "#FFE082",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        justifyContent: "space-between",
        alignItems: "center",
    },
    promoTextContainer: {
        flex: 1,
    },
    promoLabel: {
        fontSize: 16,
        fontWeight: "bold",
    },
    promoDescription: {
        fontSize: 14,
        color: "#666",
    },
    copyButton: {
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    copyButtonText: {
        color: "#000",
        fontWeight: "bold",
    },
    continueButton: {
        backgroundColor: "#0066CC",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 30,
    },
    continueButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
        textAlign: "center",
    },
    infoContainer: {
        gap: 12,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 4,
        marginBottom: 4,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
    },
    infoLabel: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    infoValue: {
        fontSize: 16,
        color: "#666",
        textAlign: "right",
        flex: 1,
        marginLeft: 20,
    },
    // Estilos para el botón de información
    infoButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f8ff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#0066CC",
    },
    infoButtonText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: "#0066CC",
        fontWeight: "500",
    },
    // Estilos para el modal
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: screenHeight * 0.8,
        minHeight: screenHeight * 0.6,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        backgroundColor: "#fff",
    },
    modalHandle: {
        position: "absolute",
        top: 10,
        left: "50%",
        marginLeft: -20,
        width: 40,
        height: 4,
        backgroundColor: "#ddd",
        borderRadius: 2,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
        textAlign: "center",
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: "#f5f5f5",
    },
    modalBody: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    infoSection: {
        backgroundColor: "#fff",
        padding: 20,
        marginBottom: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: "#0066CC",
    },
    priceCard: {
        backgroundColor: "#f0f8ff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#0066CC",
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    priceLabel: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    priceValue: {
        fontSize: 18,
        color: "#0066CC",
        fontWeight: "bold",
    },
    servicesTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 10,
    },
    servicesList: {
        gap: 12,
        marginTop: 8,
    },
    serviceItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 8,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: "#0066CC",
    },
    serviceText: {
        fontSize: 16,
        color: "#666",
    },
    infoText: {
        fontSize: 15,
        color: "#666",
        marginBottom: 12,
        lineHeight: 22,
        padding: 8,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: "#28a745",
    },
    // Estilos para políticas de cancelación
    policyTable: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f5f5f5",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    tableHeaderText: {
        flex: 1,
        padding: 12,
        fontWeight: "600",
        fontSize: 14,
        color: "#333",
        textAlign: "center",
    },
    tableRow: {
        flexDirection: "row",
        backgroundColor: "#fff",
    },
    tableCell: {
        flex: 1,
        padding: 12,
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        borderRightWidth: 1,
        borderRightColor: "#ddd",
    },
    policyNote: {
        fontSize: 13,
        color: "#666",
        marginBottom: 10,
        lineHeight: 18,
        fontStyle: "italic",
    }, // Estilos para otras políticas
    policyItem: {
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    policyTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    policyDescription: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        marginBottom: 4,
    },
    seeMore: {
        color: "#0066CC",
        fontWeight: "500",
    },
});
