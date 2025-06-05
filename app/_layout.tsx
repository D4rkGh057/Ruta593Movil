import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import SessionStorage from "./adapters/stores/SessionStorage";
import TabNavigator from "./ui/navigation/TabNavigator";
import LoginScreen from "./ui/screens/LoginScreen";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Inter: require("../assets/fonts/Inter_18pt-Bold.ttf"),
    });
    const [logueado, setLogueado] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            console.log("Checking session...", AsyncStorage.getItem("userToken"));
            const token = await SessionStorage.getSession();
            if (token) {
                setLogueado(true);
            }
            setIsLoading(false);
        };
        checkSession();
    }, []);

    if (!fontsLoaded || isLoading) return null;

    return (
        <SafeAreaProvider>
            {logueado ? <TabNavigator /> : <LoginScreen onLogin={() => setLogueado(true)} />}
        </SafeAreaProvider>
    );
}
