import { useAuthStore } from "@/app/adapters/stores/authStore";
import SessionStorage from "@/app/adapters/stores/SessionStorage";
import { User } from "@/app/core/domain/User";
import { UserService } from "@/app/core/infrastructure/UserService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PerfilScreen() {

    const navigation = useNavigation();
    const [usuario, setUser] = useState<User | null>(null);
    const { getUserId } = useAuthStore();

    const userId = getUserId();

    //Funcion para obtener los datos del usuario
    const getUserData = async () => {
        try {
            if (!userId) {
                console.log("ID de usuario no definido");
                return;
            }
            const userService = new UserService();
            const user = await userService.getById(userId);
            if (user) {
                setUser(user);
                console.log("Datos del usuario obtenidos:", user);
            }
        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
        }
    }

    useEffect(() => {
        // Obtener los datos del usuario al cargar el componente
        getUserData();
    }, []);


    // Función para obtener la imagen según la hora del día
    const getHeaderImage = () => {
        const currentHour = new Date().getHours();

        if (currentHour >= 6 && currentHour < 12) {
            // Mañana (6:00 - 11:59) - usando mountain.png como imagen de mañana
            return require("../../../assets/images/profilebg.png");
        } else if (currentHour >= 12 && currentHour < 18) {
            // Tarde (12:00 - 17:59)
            return require("../../../assets/images/tarde.png");
        } else {
            // Noche (18:00 - 5:59)
            return require("../../../assets/images/noche.png");
        }
    };

    const handleLogout = async () => {
        await SessionStorage.clearSession();
        console.log("Sesión cerrada");
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={getHeaderImage()}
                    style={styles.headerImage}
                />
                <View className="text-white" style={styles.headerContent}>
                    <Text className="text-white" style={styles.name}>
                        {usuario ? `${usuario.primer_nombre} ${usuario.primer_apellido}` : 'Cargando...'}
                    </Text>
                    <Text className="text-white" style={styles.email}>
                        {usuario ? usuario.correo : 'Cargando...'}
                    </Text>
                    <Text className="text-white" style={styles.memberSince}>
                        Miembro desde {usuario?.fecha_creacion
                            ? new Date(usuario.fecha_creacion).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long'
                            })
                            : 'Cargando...'}
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mis Detalles</Text>
                <TouchableOpacity style={styles.item} onPress={() => (navigation as any).navigate("Boletos")}>
                    <Ionicons name="list-outline" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Reservaciones</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={() => console.log("Información personal")}>
                    <Ionicons name="person-outline" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Información personal</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Más</Text>
                <TouchableOpacity style={styles.item} onPress={() => (navigation as any).navigate("Ofertas")}>
                    <Ionicons name="pricetag-outline" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Ofertas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={() => console.log("Conoce Ruta593")}>
                    <Ionicons name="help-circle-outline" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Conoce Ruta593</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={() => (navigation as any).navigate("Ayuda")}>
                    <Ionicons name="help-outline" size={24} color="#000" style={styles.icon} />
                    <Text style={styles.label}>Ayuda</Text>
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
        width: 412,
        height: 200,
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
