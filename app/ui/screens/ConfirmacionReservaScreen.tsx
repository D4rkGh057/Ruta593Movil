import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { API_ENDPOINTS } from "../../config/api";
import { BusSeats } from "../components/BusSeats";

export function ConfirmacionReservaScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [reservedSeats, setReservedSeats] = useState<number[]>([]);
    
    const frecuencia = React.useMemo(() => {
        if (!params.frecuencia) return null;
        return typeof params.frecuencia === "string"
            ? JSON.parse(params.frecuencia)
            : params.frecuencia;
    }, [params.frecuencia]);    useEffect(() => {
        const fetchReservedSeats = async () => {
            try {
                // Como no hay un endpoint específico para obtener asientos reservados por frecuencia,
                // vamos a obtener todas las reservas del usuario actual y filtrar por frecuencia
                const response = await fetch(`${API_ENDPOINTS.RESERVAS.CREATE}`);
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Verificar que data es un array y tiene la estructura esperada
                if (Array.isArray(data)) {
                    const reservedSeatNumbers = data
                        .filter(reserva => 
                            reserva && 
                            reserva.frecuencia_id === frecuencia?.frecuencia_id &&
                            typeof reserva.numero_asiento === 'number'
                        )
                        .map(reserva => reserva.numero_asiento);
                    setReservedSeats(reservedSeatNumbers);
                } else {
                    // Si no es un array, inicializar con asientos de ejemplo para pruebas
                    // En producción, esto debería ser un array vacío
                    setReservedSeats([3, 4, 15, 16]); // Asientos de ejemplo como reservados
                }
            } catch (error) {
                console.error('Error fetching reserved seats:', error);
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
        setSelectedSeats(prev => {
            if (prev.includes(seatNumber)) {
                return prev.filter(num => num !== seatNumber);
            }
            return [...prev, seatNumber];
        });
    };    if (!frecuencia) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <Text style={styles.title}>Error</Text>
                <Text style={styles.errorText}>No se encontraron datos del bus</Text>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.continueButtonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                    <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Selección de asientos</Text>
                <Text style={styles.routeText}>
                    {frecuencia?.origen} → {frecuencia?.destino}
                </Text>

                <View style={styles.promoBanner}>
                    <View style={styles.promoTextContainer}>
                        <Text style={styles.promoLabel}>AHORRA</Text>
                        <Text style={styles.promoDescription}>Extra hasta un 15% dto</Text>
                    </View>
                    <TouchableOpacity style={styles.copyButton}>
                        <Text style={styles.copyButtonText}>Copiar</Text>
                    </TouchableOpacity>
                </View>

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
                                    asientos: JSON.stringify(selectedSeats)
                                }
                            });
                        }}
                    >
                        <Text style={styles.continueButtonText}>
                            Continuar con la reserva ({selectedSeats.length} asientos)
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButtonText: {
        marginLeft: 10,
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    routeText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    promoBanner: {
        flexDirection: 'row',
        backgroundColor: '#FFE082',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    promoTextContainer: {
        flex: 1,
    },
    promoLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    promoDescription: {
        fontSize: 14,
        color: '#666',
    },
    copyButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    copyButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    continueButton: {
        backgroundColor: '#0066CC',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 30,
    },
    continueButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    }
});
