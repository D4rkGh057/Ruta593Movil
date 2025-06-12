import { useFonts } from "expo-font";
import { Slot, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import SessionStorage from "./adapters/stores/SessionStorage";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Inter: require("../assets/fonts/Inter_18pt-Bold.ttf"),
    });
    const [logueado, setLogueado] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [redirected, setRedirected] = useState(false); // Nuevo estado para controlar la redirección
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkSession = async () => {
            if (redirected) return; // Evitar redirección múltiple

            console.log("Checking session...");
            const token = await SessionStorage.getSession();
            if (token) {
                console.log("Usuario autenticado, redirigiendo al home...");
                setLogueado(true);
                if (pathname !== "/home") {
                    setRedirected(true);
                    router.replace("/home");
                }
            } else {
                console.log("Usuario no autenticado, redirigiendo al login...");
                setLogueado(false);
                if (pathname !== "/login") {
                    setRedirected(true);
                    router.replace("/login");
                }
            }
            setIsLoading(false);
        };
        checkSession();
    }, [pathname, redirected]);

    if (!fontsLoaded || isLoading) return null;

    return (
        <SafeAreaProvider>
            <Slot />
        </SafeAreaProvider>
    );
}
