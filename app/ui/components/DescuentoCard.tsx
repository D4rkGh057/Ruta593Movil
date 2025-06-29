import { Descuento } from "@/app/core/domain/Descuento";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DescuentoCardProps {
    descuento: Descuento;
    onPress?: (descuento: Descuento) => void;
}

export const DescuentoCard: React.FC<DescuentoCardProps> = ({ descuento, onPress }) => {
    // Verificamos que el descuento tenga un código promocional
    console.log("Datos del descuento:", descuento);
    
    const handlePress = () => {
        if (onPress) {
            onPress(descuento);
        }
    };

    // Función para formatear la fecha
    const formatFecha = (fechaStr: string) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Usamos una URL de imagen predeterminada si no hay link_descarga
    // Esto nos ayudará a evitar problemas con las rutas de archivos locales
    const defaultImageUrl = "https://i.imgur.com/8OkKhbJ.png"; // Imagen de placeholder genérica

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={styles.container}
            disabled={!onPress || !descuento.activo}
        >
            <View style={[
                styles.cardContainer,
                { backgroundColor: descuento.activo ? 'white' : '#f0f0f0' }
            ]}>
                <View style={styles.contentRow}>
                    {/* Lado izquierdo - Imagen */}
                    <View style={styles.imageContainer}>
                        <Image 
                            source={descuento.link_descarga ? {uri: descuento.link_descarga} : {uri: defaultImageUrl}}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                    
                    {/* Lado derecho - Información */}
                    <View style={styles.infoContainer}>
                        <View>
                            <Text style={styles.ahorroText}>¡Ahorra hasta un</Text>
                            <Text style={styles.porcentaje}>{descuento.porcentaje}%!</Text>
                            <Text style={styles.fecha}>Válida hasta: {formatFecha(descuento.vida_util)}</Text>
                        </View>
                        
                        <View style={styles.codigoContainer}>
                            <TouchableOpacity 
                                style={styles.botonPromo}
                                onPress={() => {
                                    console.log("Código promocional copiado:", descuento.codigo_promocional);
                                    // Aquí podrías añadir lógica para copiar al portapapeles
                                }}
                            >
                                <Text style={styles.botonTexto}>
                                    {descuento.codigo_promocional || "NO DISPONIBLE"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                
                {!descuento.activo && (
                    <View style={styles.inactiveOverlay}>
                        <Text style={styles.inactiveText}>No Disponible</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
    cardContainer: {
        borderRadius: 12,
        backgroundColor: "white",
        overflow: "hidden",
    },
    contentRow: {
        flexDirection: "row",
        alignItems: "stretch",
        height: 200,
    },
    imageContainer: {
        width: "45%",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f8f8",
    },
    image: {
        width: "100%",
        aspectRatio: 1,
    },
    infoContainer: {
        flex: 1,
        padding: 12,
        justifyContent: "space-between",
    },
    ahorroText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    porcentaje: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#0066cc", // Azul
        marginVertical: 4,
    },
    fecha: {
        fontSize: 12,
        color: "#777",
    },
    codigoContainer: {
        marginTop: 8,
    },
    codigoLabel: {
        fontSize: 12,
        color: "#333",
        marginBottom: 4,
        fontWeight: "700", // Más negrita
        textTransform: "uppercase",
        letterSpacing: 0.5, // Espacio entre letras
    },
    botonPromo: {
        backgroundColor: "#FFD700", // Amarillo
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: "flex-start",
        elevation: 3, // Aumentamos la elevación
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3, // Aumentamos la opacidad de la sombra
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: "#E6C200", // Borde ligeramente más oscuro
        minWidth: 120, // Establecemos un ancho mínimo
    },
    botonTexto: {
        color: "#000", // Negro
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
        letterSpacing: 0.5, // Mayor legibilidad
    },
    inactiveOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    inactiveText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
