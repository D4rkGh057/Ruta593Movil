import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AyudaScreen() {
const router = useRouter();
const hasTrips = false; // Cambiar a true si hay viajes disponibles

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <View className="flex flex-row items-center justify-between mb-4 m-2">
                    <Text style={styles.sectionTitle}>¿Necesita ayuda con este viaje?</Text>
                    <TouchableOpacity style={styles.linkContainer}>
                        <Text style={styles.linkText}>Ver todo</Text>
                    </TouchableOpacity>
                </View>
                {!hasTrips && (
                  <>
                    <Image source={require("../../../assets/fantasma.png")} style={styles.image} />
                    <Text style={styles.noDataText}>No hay viajes recientes</Text>
                  </>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
                <View className="bg-white p-4">
                    <TouchableOpacity className="flex flex-row items-center" onPress={() => router.push("/faq")}>
                        <Ionicons name="document-text-outline" size={24} color="#000" style={{ marginRight: 8 }} />
                        <Text style={{ fontFamily: "Inter", color: "#000" }}>Lea todas las FAQs</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Otros temas</Text>
                <View className="bg-white p-4 w-full">
                    <TouchableOpacity className="flex flex-row items-center" onPress={() => router.push("/other-themes")}>
                        <Ionicons name="document-text-outline" size={24} color="#000" style={{ marginRight: 8 }} />
                        <Text style={{ fontFamily: "Inter", color: "#000" }}>Explora otros temas</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        fontFamily: "Inter"
    },
    title: {
        fontSize: 16,
        marginBottom: 16,
        fontFamily: "Inter"
    },
    section: {
        marginBottom: 24,
        padding:0
    },
    sectionTitle: {
        fontSize: 16,
        paddingLeft: 16,
        marginBottom: 8,
        fontFamily: "Inter"
    },
    linkContainer: {
        marginBottom: 8,
    },
    linkText: {
        color: "#007BFF",
        textDecorationLine: "underline",
        fontFamily: "Inter",
        fontSize: 14,
        marginRight: 16
    },
    image: {
        width: 100,
        height: 100,
        alignSelf: "center",
        marginVertical: 8,
    },
    noDataText: {
        textAlign: "center",
        color: "#888",
        fontFamily: "Inter"
    },
});
