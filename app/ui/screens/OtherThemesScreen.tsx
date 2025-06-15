import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OtherThemesScreen() {
    const themes = [
        {
            title: "Ayuda con Reservas",
            content: "Para reservar un boleto, ingresa a la sección de Boletos, selecciona tu origen, destino y fecha, y sigue las instrucciones para completar la reserva."
        },
        {
            title: "Información de Ofertas",
            content: "Cada semana ofrecemos descuentos especiales en rutas seleccionadas. Consulta la sección de Ofertas para más detalles."
        },
        {
            title: "Políticas de Cancelación",
            content: "Nuestras políticas de cancelación permiten cambios hasta 24 horas antes del viaje. Consulta la sección de Políticas para más información."
        },
    ];

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleContent = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <SafeAreaView className="bg-yellow-300" style={styles.container}>
            <Text style={styles.title}>Otros Temas</Text>
            {themes.map((theme, index) => (
                <View key={theme.title} style={styles.faqItem}>
                    <TouchableOpacity style={styles.questionContainer} onPress={() => toggleContent(index)}>
                        <Text style={styles.question}>{theme.title}</Text>
                        <Ionicons name="chevron-down" size={24} color="#333" />
                    </TouchableOpacity>
                    {activeIndex === index && <Text style={styles.answer}>{theme.content}</Text>}
                </View>
            ))}
            <View style={styles.footer}>
                <Image
                    source={require("../../../assets/images/ruta593.png")}
                    style={styles.footerImage}
                />
                <Image
                    source={require("../../../assets/images/mountain.png")}
                    style={styles.footerImage}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    faqItem: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderBottomColor: "#000000",
    },
    questionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    question: {
        fontSize: 14,
        fontFamily: "Inter",
        color: "#333",
    },
    answer: {
        marginTop: 10,
        fontSize: 13,
        fontFamily: "Inter",
        color: "#666",
        lineHeight: 22,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "auto",
        paddingVertical: 16,
    },
    footerImage: {
        width: 100,
        height: 50,
        marginHorizontal: 8,
        resizeMode: "contain",
    },
});
