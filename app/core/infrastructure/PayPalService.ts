// Servicio para integración con PayPal

// Configuración de PayPal
export const PAYPAL_CONFIG = {
    CLIENT_ID: 'AbAlInk8N7OlODztTg0cBkwDMytjvoRHRgE8aTgphB7MJTzGMLkUBE6QSB_PmoDn90CxuF9THfIU6hFb',
    SECRET_KEY: 'EAhCNbyNWR5suIGlPChJqXZlBiwQj2_dtCglF1p7HEPZ_FJW9RIq8Tc2vImVEucB7w0fQGJ4DwKB__ve',
    SANDBOX_URL: 'https://sandbox.paypal.com',
    API_URL: 'https://api.sandbox.paypal.com',
    REGION: 'EC',
    EMAIL: 'sb-yc1x443727380@business.example.com'
};

// Validar que las credenciales estén configuradas
if (!PAYPAL_CONFIG.CLIENT_ID || !PAYPAL_CONFIG.SECRET_KEY) {
    console.error('🔍 PayPal - ERROR: Credenciales no configuradas');
    throw new Error('Credenciales de PayPal no configuradas');
}

interface PayPalPayment {
    amount: number;
    currency: string;
    description: string;
    return_url: string;
    cancel_url: string;
}

interface PayPalOrderRequest {
    intent: string;
    purchase_units: Array<{
        amount: {
            currency_code: string;
            value: string;
        };
        description: string;
    }>;
    application_context: {
        return_url: string;
        cancel_url: string;
        brand_name: string;
        user_action: string;
    };
}

export class PayPalService {
    private static accessToken: string | null = null;
    private static tokenExpiry: number = 0;

    /**
     * Obtiene el token de acceso de PayPal
     */
    private static async getAccessToken(): Promise<string> {
        // Verificar si el token actual aún es válido
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            console.log('🔍 PayPalService.getAccessToken - Usando token existente');
            return this.accessToken;
        }
        
        try {
            console.log('🔍 PayPalService.getAccessToken - Obteniendo nuevo token...');
            console.log('  - CLIENT_ID:', PAYPAL_CONFIG.CLIENT_ID.substring(0, 10) + '...');
            console.log('  - API_URL:', PAYPAL_CONFIG.API_URL);
            
            // Codificar credenciales en base64 (React Native compatible)
            const credentials = btoa(`${PAYPAL_CONFIG.CLIENT_ID}:${PAYPAL_CONFIG.SECRET_KEY}`);
            
            const response = await fetch(`${PAYPAL_CONFIG.API_URL}/v1/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Accept-Language': 'en_US',
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'grant_type=client_credentials'
            });

            console.log('🔍 PayPalService.getAccessToken - Respuesta:');
            console.log('  - response.status:', response.status);
            console.log('  - response.ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('🔍 PayPalService.getAccessToken - ERROR:');
                console.error('  - response.status:', response.status);
                console.error('  - errorText:', errorText);
                throw new Error(`Error al obtener token de PayPal: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('🔍 PayPalService.getAccessToken - Token obtenido exitosamente');
            console.log('  - expires_in:', data.expires_in);
            
            this.accessToken = data.access_token;
            // Configurar expiración con un margen de seguridad de 5 minutos
            this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
            
            return this.accessToken!;
        } catch (error) {
            console.error('🔍 PayPalService.getAccessToken - CATCH ERROR:', error);
            throw new Error('No se pudo conectar con PayPal');
        }
    }

    /**
     * Crea una orden de pago en PayPal
     */
    static async createOrder(payment: PayPalPayment): Promise<string> {
        try {
            console.log('🔍 PayPalService.createOrder - INICIO');
            console.log('  - payment recibido:', JSON.stringify(payment, null, 2));
            
            const accessToken = await this.getAccessToken();
            console.log('🔍 PayPalService.createOrder - Token obtenido exitosamente');
            
            const orderRequest: PayPalOrderRequest = {
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: payment.currency,
                        value: payment.amount.toFixed(2)
                    },
                    description: payment.description
                }],
                application_context: {
                    return_url: payment.return_url,
                    cancel_url: payment.cancel_url,
                    brand_name: 'Ruta593',
                    user_action: 'PAY_NOW'
                }
            };

            console.log('🔍 PayPalService.createOrder - Datos que se envían:');
            console.log('  - orderRequest:', JSON.stringify(orderRequest, null, 2));
            console.log('  - API URL:', `${PAYPAL_CONFIG.API_URL}/v2/checkout/orders`);

            const response = await fetch(`${PAYPAL_CONFIG.API_URL}/v2/checkout/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'PayPal-Request-Id': `ruta593-${Date.now()}`,
                },
                body: JSON.stringify(orderRequest)
            });

            console.log('🔍 PayPalService.createOrder - Respuesta PayPal:');
            console.log('  - response.status:', response.status);
            console.log('  - response.ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('🔍 PayPalService.createOrder - ERROR DETAILS:');
                console.error('  - response.status:', response.status);
                console.error('  - errorData completo:', JSON.stringify(errorData, null, 2));
                console.error('  - Error creando orden PayPal:', errorData);
                throw new Error(`Error al crear orden en PayPal: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const orderData = await response.json();
            console.log('Orden PayPal creada:', orderData.id);
            
            // Buscar el enlace de aprobación
            const approveLink = orderData.links?.find((link: any) => link.rel === 'approve');
            if (!approveLink) {
                throw new Error('No se encontró el enlace de aprobación de PayPal');
            }

            return approveLink.href;
        } catch (error) {
            console.error('Error creando orden PayPal:', error);
            throw error;
        }
    }

    /**
     * Captura el pago después de la aprobación del usuario
     */
    static async captureOrder(orderId: string): Promise<any> {
        try {
            const accessToken = await this.getAccessToken();

            const response = await fetch(`${PAYPAL_CONFIG.API_URL}/v2/checkout/orders/${orderId}/capture`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'PayPal-Request-Id': `ruta593-capture-${Date.now()}`,
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error capturando pago PayPal:', errorData);
                throw new Error(`Error al capturar pago en PayPal: ${response.status}`);
            }

            const captureData = await response.json();
            console.log('Pago capturado exitosamente:', captureData.id);
            
            return captureData;
        } catch (error) {
            console.error('Error capturando orden PayPal:', error);
            throw error;
        }
    }

    /**
     * Obtiene los detalles de una orden
     */
    static async getOrderDetails(orderId: string): Promise<any> {
        try {
            const accessToken = await this.getAccessToken();

            const response = await fetch(`${PAYPAL_CONFIG.API_URL}/v2/checkout/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (!response.ok) {
                throw new Error(`Error al obtener detalles de la orden: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo detalles de orden PayPal:', error);
            throw error;
        }
    }

    /**
     * Valida el estado de un pago
     */
    static validatePaymentStatus(captureData: any): boolean {
        return captureData.status === 'COMPLETED' && 
               captureData.purchase_units?.[0]?.payments?.captures?.[0]?.status === 'COMPLETED';
    }

    /**
     * Extrae información del pago completado
     */
    static extractPaymentInfo(captureData: any) {
        const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];
        return {
            transactionId: capture?.id ?? captureData.id,
            amount: parseFloat(capture?.amount?.value ?? '0'),
            currency: capture?.amount?.currency_code ?? 'USD',
            status: capture?.status ?? captureData.status,
            payerEmail: captureData.payer?.email_address,
            payerName: `${captureData.payer?.name?.given_name ?? ''} ${captureData.payer?.name?.surname ?? ''}`.trim(),
            completedAt: capture?.create_time ?? captureData.create_time
        };
    }
}
