import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SeatProps {
    number: number;
    status: 'available' | 'reserved' | 'selected';
    onSelect: (number: number) => void;
}

const Seat: React.FC<SeatProps> = ({ number, status, onSelect }) => {
    const seatColor = {
        available: '#008f39',  // verde
        reserved: '#ff0000',   // rojo
        selected: '#ffd700'    // amarillo
    }[status];

    return (
        <TouchableOpacity 
            onPress={() => status === 'available' && onSelect(number)}
            style={[styles.seat, { borderColor: seatColor }]}
            disabled={status === 'reserved'}
        >
            <Ionicons name="person" size={24} color={seatColor} />
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
    onSeatSelect
}) => {
    const renderSeats = () => {
        const seats = [];
        for (let i = 1; i <= totalSeats; i++) {
            const status = reservedSeats.includes(i) 
                ? 'reserved' 
                : selectedSeats.includes(i) 
                    ? 'selected' 
                    : 'available';
            
            seats.push(
                <Seat 
                    key={i} 
                    number={i} 
                    status={status} 
                    onSelect={onSeatSelect}
                />
            );
        }
        return seats;
    };

    return (
        <View style={styles.container}>
            <View style={styles.steeringWheel}>
                <Ionicons name="car" size={32} color="#666" />
            </View>
            <View style={styles.seatsContainer}>
                <View style={styles.leftColumn}>
                    {renderSeats().slice(0, totalSeats / 2)}
                </View>
                <View style={styles.aisle} />
                <View style={styles.rightColumn}>
                    {renderSeats().slice(totalSeats / 2)}
                </View>
            </View>
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendBox, { backgroundColor: '#008f39' }]} />
                    <Text>Disponible (COP 170.000.00)</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendBox, { backgroundColor: '#ff0000' }]} />
                    <Text>Ya está reservado</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendBox, { backgroundColor: '#ffd700' }]} />
                    <Text>Seleccionado</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    steeringWheel: {
        alignItems: 'center',
        marginBottom: 20,
    },
    seatsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    leftColumn: {
        marginRight: 10,
    },
    rightColumn: {
        marginLeft: 10,
    },
    aisle: {
        width: 20,
    },
    seat: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderRadius: 8,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    legendContainer: {
        marginTop: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    legendBox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        marginRight: 10,
    },
});
