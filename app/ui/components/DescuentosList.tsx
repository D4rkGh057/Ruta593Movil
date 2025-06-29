import { Descuento } from "@/app/core/domain/Descuento";
import { useDescuentos } from "@/app/hooks/useDescuentos";
import React from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { DescuentoCard } from "./DescuentoCard";

interface DescuentosListProps {
    onSelectDescuento?: (descuento: Descuento) => void;
    showActiveOnly?: boolean;
}

export const DescuentosList: React.FC<DescuentosListProps> = ({
    onSelectDescuento,
    showActiveOnly = false,
}) => {
    const { descuentos, loading, error, getDescuentos, refreshDescuentos } = useDescuentos(true);

    // Verificar si un descuento está vigente (no caducado)
    const isDescuentoVigente = (descuento: Descuento): boolean => {
        // Verificamos que esté activo
        if (!descuento.activo) return false;
        
        // Verificamos la fecha de caducidad
        const fechaActual = new Date();
        const fechaCaducidad = new Date(descuento.vida_util);
        
        // El descuento está vigente si la fecha actual es menor a la fecha de caducidad
        return fechaActual <= fechaCaducidad;
    };

    const filteredDescuentos = showActiveOnly
        ? descuentos.filter(isDescuentoVigente)
        : descuentos;

    // Cuando hacemos refresh, forzamos la recarga desde la API
    const handleRefresh = () => {
        console.log("Recargando descuentos desde la API...");
        refreshDescuentos(); // Usamos la nueva función que siempre recarga desde la API
    };

    if (loading && descuentos.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0066cc" />
                <Text style={styles.loadingText}>Cargando descuentos...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <Text style={styles.retryText} onPress={getDescuentos}>
                    Intentar nuevamente
                </Text>
            </View>
        );
    }

    if (filteredDescuentos.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>
                    {showActiveOnly
                        ? "No hay descuentos activos disponibles"
                        : "No hay descuentos disponibles"}
                </Text>
                <Text style={styles.retryText} onPress={getDescuentos}>
                    Actualizar
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={filteredDescuentos}
            keyExtractor={(item) => item.descuento_id ?? item.codigo_promocional}
            renderItem={({ item }) => (
                <DescuentoCard
                    descuento={item}
                    onPress={onSelectDescuento}
                />
            )}
            contentContainerStyle={styles.listContainer}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
            }
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 8,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        marginTop: 10,
        color: "#666",
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginBottom: 10,
    },
    retryText: {
        fontSize: 16,
        color: "#0066cc",
        textDecorationLine: "underline",
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 10,
    },
});
