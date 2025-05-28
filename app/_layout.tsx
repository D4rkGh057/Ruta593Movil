import { useFonts } from "expo-font";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import TabNavigator from "./ui/navigation/TabNavigator";
import LoginScreen from "./ui/screens/LoginScreen";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Inter: require("../assets/fonts/Inter_18pt-Bold.ttf"),
    });
    const [logueado, setLogueado] = useState(false);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaProvider>
            {logueado ? (
                <TabNavigator />
            ) : (
                <LoginScreen onLogin={() => setLogueado(true)} />
            )}
        </SafeAreaProvider>
    );
}
