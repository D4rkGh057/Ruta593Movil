import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SessionStorage from './app/adapters/stores/SessionStorage';

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const token = await SessionStorage.getSession();
            if (token) {
                router.replace('/home');
            } else {
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