import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SeatProps {
    number: number;
    status: "available" | "reserved" | "selected";
    onSelect: (number: number) => void;
}
const Seat: React.FC<SeatProps> = ({ number, status, onSelect }) => {
    const seatColor = {
        available: "#008f39", // verde
        reserved: "#ff0000", // rojo
        selected: "#ffd700", // amarillo
    }[status];

    return (
        <TouchableOpacity
            onPress={() => (status === "available" || status === "selected") && onSelect(number)}
            style={styles.seat}
            disabled={status === "reserved"}
        >
            <MaterialCommunityIcons name="seat-outline" size={28} color={seatColor} />
        </TouchableOpacity>
    );
};

interface BusSeatsProps {
    totalSeats: number;
    reservedSeats: number[];
    selectedSeats: number[];
    onSeatSelect: (seatNumber: number) => void;
}

export const BusSeats: React.FC<BusSeatsProps> = ({
    totalSeats,
    reservedSeats,
    selectedSeats,
    onSeatSelect,
}) => {
    const buildRows = () => {
        const rows: React.ReactNode[] = [];
        let seatNumber = 1;
        const totalRows = Math.ceil(totalSeats / 4);

        // Agregar la fila del conductor primero
        rows.push(
            <View key="driver-row" style={styles.driverRow}>
                <View style={styles.steeringSection}>
                    <MaterialCommunityIcons name="steering" size={32} color="#666" />
                </View>
                <View style={styles.emptySection} />
            </View>
        );

        for (let r = 0; r < totalRows; r++) {
            const seatsInRow: React.ReactNode[] = [];

            for (let c = 0; c < 4 && seatNumber <= totalSeats; c++) {
                // Insert aisle visual gap after two seats (index 0 and 1 are left side)
                if (c === 2) {
                    seatsInRow.push(<View key={`aisle-${r}`} style={styles.aisle} />);
                }

                const status: "available" | "reserved" | "selected" = reservedSeats.includes(
                    seatNumber
                )
                    ? "reserved"
                    : selectedSeats.includes(seatNumber)
                    ? "selected"
                    : "available";

                seatsInRow.push(
                    <Seat
                        key={seatNumber}
                        number={seatNumber}
                        status={status}
                        onSelect={onSeatSelect}
                    />
                );
                seatNumber++;
            }

            rows.push(
                <View key={`row-${r}`} style={styles.row}>
                    {seatsInRow}
                </View>
            );
        }

        return rows;
    };

    return (
        <View style={styles.mainContainer}>
            {/* Tarjeta del bus */}
            <View style={styles.container}>
                <View style={styles.seatsContainer}>{buildRows()}</View>
            </View>

            {/* Tarjeta de tipos de asientos */}
            <View style={styles.legendCard}>
                <Text style={styles.legendTitle}>Conozca sus tipos de asientos</Text>
                <View style={styles.legendDivider} />
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <MaterialCommunityIcons
                            name="seat-outline"
                            size={24}
                            color="#008f39"
                            style={{ marginRight: 10 }}
                        />
                        <View>
                            <Text style={styles.legendItemTitle}>Disponible</Text>
                            <Text style={styles.legendItemPrice}>COP 170.000.00</Text>
                        </View>
                    </View>
                    <View style={styles.legendItem}>
                        <MaterialCommunityIcons
                            name="seat-outline"
                            size={24}
                            color="#ff0000"
                            style={{ marginRight: 10 }}
                        />
                        <Text style={styles.legendItemTitle}>Ya está reservado</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <MaterialCommunityIcons
                            name="seat-outline"
                            size={24}
                            color="#ffd700"
                            style={{ marginRight: 10 }}
                        />
                        <Text style={styles.legendItemTitle}>Seleccionado</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        gap: 20,
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: 25,
        borderWidth: 2,
        borderColor: "#ddd",
        width: "90%",
        alignSelf: "center",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    seatsContainer: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        paddingVertical: 15,
    },
    driverRow: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 25,
        paddingTop: 20,
        borderTopLeftRadius: 23,
        borderTopRightRadius: 23,
        backgroundColor: "#f5f5f5",
    },
    steeringSection: {
        flex: 1,
        alignItems: "flex-start",
        paddingLeft: 20,
    },
    emptySection: {
        flex: 3,
    },
    aisle: {
        width: 40,
    },
    seat: {
        margin: 8,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    // Estilos para la tarjeta de leyenda
    legendCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#ddd",
        width: "90%",
        alignSelf: "center",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 15,
    },
    legendTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
        color: "#333",
    },
    legendDivider: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 10,
    },
    legendContainer: {
        gap: 15,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    legendItemTitle: {
        fontSize: 16,
        color: "#333",
    },
    legendItemPrice: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
});
