import { Descuento } from "@/app/core/domain/Descuento";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DescuentosList } from "../components/DescuentosList";

export default function OfertasScreen() {
    const [filterOption, setFilterOption] = useState<'todos' | 'activos'>('activos');

    const handleSelectDescuento = (descuento: Descuento) => {
        // Aquí puedes implementar la navegación a la página de detalles
        // o mostrar un modal con los detalles del descuento
        console.log("Descuento seleccionado:", descuento);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
            <Text style={styles.subtitle}>Descubre nuestras mejores promociones</Text>    
                <View style={styles.filterContainer}>
                    <View style={styles.segmentedButtonsContainer}>
                        <TouchableOpacity 
                            style={[
                                styles.segmentButton, 
                                filterOption === 'activos' && styles.segmentButtonActive
                            ]} 
                            onPress={() => setFilterOption('activos')}
                        >
                            <Text style={[
                                styles.segmentButtonText,
                                filterOption === 'activos' && styles.segmentButtonTextActive
                            ]}>Activos</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[
                                styles.segmentButton, 
                                filterOption === 'todos' && styles.segmentButtonActive
                            ]} 
                            onPress={() => setFilterOption('todos')}
                        >
                            <Text style={[
                                styles.segmentButtonText,
                                filterOption === 'todos' && styles.segmentButtonTextActive
                            ]}>Todos</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            
            <DescuentosList 
                onSelectDescuento={handleSelectDescuento} 
                showActiveOnly={filterOption === 'activos'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
    },
    filterContainer: {
        marginTop: 10,
    },
    segmentedButtonsContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#0066cc',
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    segmentButtonActive: {
        backgroundColor: '#0066cc',
    },
    segmentButtonText: {
        fontSize: 14,
        color: '#0066cc',
        fontWeight: '500',
    },
    segmentButtonTextActive: {
        color: 'white',
    },
});
