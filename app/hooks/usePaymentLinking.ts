import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export function usePaymentLinking() {
    const router = useRouter();

    useEffect(() => {
        const handleDeepLink = (url: string) => {
            console.log('Deep link recibido:', url);
            
            // Verificar si es un enlace de pago
            if (url.includes('payment/success') || url.includes('PayerID')) {
                // En lugar de navegar a una nueva pantalla, vamos a boletos
                router.push('/(tabs)/boletos');
            } else if (url.includes('payment/cancel')) {
                // Navegar de vuelta al inicio
                router.push('/');
            }
        };

        // Escuchar enlaces cuando la app está abierta
        const subscription = Linking.addEventListener('url', (event: any) => {
            handleDeepLink(event.url);
        });

        // Verificar si la app se abrió con un enlace
        Linking.getInitialURL().then((url: string | null) => {
            if (url) {
                handleDeepLink(url);
            }
        });

        return () => subscription?.remove();
    }, [router]);
}

export default usePaymentLinking;
