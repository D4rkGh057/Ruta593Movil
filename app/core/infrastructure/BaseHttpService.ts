import { API_ENDPOINTS } from '../../../config/api';

// Clase base para servicios HTTP siguiendo DRY y Single Responsibility Principle
export abstract class BaseHttpService {
    protected baseUrl: string;

    constructor() {
        this.baseUrl = API_ENDPOINTS.toString();
    }

    // Método genérico para peticiones GET
    protected async get<T>(url: string): Promise<T> {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('GET request failed:', error);
            throw error;
        }
    }

    // Método genérico para peticiones POST
    protected async post<T>(url: string, data: any): Promise<T> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('POST request failed:', error);
            throw error;
        }
    }

    // Método genérico para peticiones POST con FormData (para archivos)
    protected async postFormData<T>(url: string, formData: FormData): Promise<T> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ...this.getAuthHeaders(),
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('POST FormData request failed:', error);
            throw error;
        }
    }

    // Método genérico para peticiones PUT
    protected async put<T>(url: string, data: any): Promise<T> {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('PUT request failed:', error);
            throw error;
        }
    }

    // Método genérico para peticiones PATCH
    protected async patch<T>(url: string, data: any): Promise<T> {
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('PATCH request failed:', error);
            throw error;
        }
    }

    // Método genérico para peticiones DELETE
    protected async deleteRequest<T>(url: string): Promise<T> {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Si la respuesta está vacía, retornamos un objeto vacío
            const text = await response.text();
            return text ? JSON.parse(text) : {} as T;
        } catch (error) {
            console.error('DELETE request failed:', error);
            throw error;
        }
    }

    // Método para obtener headers de autenticación
    protected getAuthHeaders(): Record<string, string> {
        // TODO: Implementar lógica de token
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    // Método para obtener el token de autenticación
    protected getToken(): string | null {
        // TODO: Implementar obtención del token desde el storage
        return null;
    }

    // Método para manejar errores de manera consistente
    protected handleError(error: any): never {
        console.error('Service error:', error);
        throw new Error(error.message || 'An unexpected error occurred');
    }
}
