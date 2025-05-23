import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "../global.css";
export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Inter: require("../assets/fonts/Inter_18pt-Bold.ttf"),
        // Agrega más fuentes si es necesario
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}
