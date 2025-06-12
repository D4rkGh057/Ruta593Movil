import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SessionStorage from "./app/adapters/stores/SessionStorage";

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            console.log("Iniciando verificación de sesión..."); // Mensaje inicial
            const token = await SessionStorage.getSession();
            console.log("Token recuperado al iniciar la app:", token); // Verificar el token recuperado
            if (token) {
                console.log("Token válido encontrado. Redirigiendo al home...");
                router.replace("/home");
            } else {
                console.log("No se encontró token. Mostrando pantalla de inicio de sesión.");
                setIsLoading(false);
            }
        };
        checkSession();
    }, []);

    if (isLoading) {
        return null; // Puedes agregar un indicador de carga aquí
    }

    return (
        <SafeAreaProvider>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName="index"
            />
        </SafeAreaProvider>
    );
}
