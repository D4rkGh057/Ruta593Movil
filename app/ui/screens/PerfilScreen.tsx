import SessionStorage from "@/app/adapters/stores/SessionStorage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PerfilScreen() {

    const navigation = useNavigation();
    const handleLogout = async () => {
        await SessionStorage.clearSession();
        console.log("Sesión cerrada");
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require("../../../assets/images/profilebg.png")}
                    style={styles.headerImage}
                />
                <View className="text-white" style={styles.headerContent}>
                    <Text className="text-white" style={styles.name}>Software Squad</Text>
                    <Text className="text-white" style={styles.email}>danielfuelpaz@softwaresquad.com</Text>
                    <Text className="text-white" style={styles.memberSince}>Miembro desde abril 2025</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mis Detalles</Text>
                <TouchableOpacity style={styles.item} onPress={() => (navigation as any).navigate("Boletos")}>
                    <Ionicons name="list" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Reservaciones</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={() => console.log("Información personal")}>
                    <Ionicons name="person" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Información personal</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pagos</Text>
                <TouchableOpacity style={styles.item} onPress={() => console.log("Métodos de pago")}>
                    <Ionicons name="card" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Métodos de pago</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Más</Text>
                <TouchableOpacity style={styles.item} onPress={() => (navigation as any).navigate("Ofertas")}>
                    <Ionicons name="pricetag" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Ofertas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={() => console.log("Conoce Ruta593")}>
                    <Ionicons name="help-circle" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Conoce Ruta593</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={() => (navigation as any).navigate("Ayuda")}>
                    <Ionicons name="help" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Ayuda</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={() => console.log("Configuraciones de la cuenta")}>
                    <Ionicons name="settings" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Configuraciones de la cuenta</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout()}>
                <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        padding: 16,
    },
    header: {
        backgroundColor: "#E0E0E0",
        borderRadius: 8,
        marginBottom: 16,
        position: "relative",
        overflow: "hidden",
    },
    headerImage: {
        width: "100%",
        height: 150,
        resizeMode: "cover",
    },
    headerContent: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 16,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        marginBottom: 4,
    },
    memberSince: {
        fontSize: 14,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    icon: {
        marginRight: 16,
    },
    label: {
        fontSize: 16,
        flex: 1,
    },
    value: {
        fontSize: 16,
        color: "#555",
    },
    logoutButton: {
        backgroundColor: "#FF3B30",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    logoutText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
