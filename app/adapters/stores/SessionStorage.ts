import AsyncStorage from "@react-native-async-storage/async-storage";

export default class SessionStorage {
    static async saveSession(token: string): Promise<void> {
        try {
            console.log("Intentando guardar el token en AsyncStorage:", token); // Mensaje de depuración
            await AsyncStorage.setItem("userToken", token);
            const savedToken = await AsyncStorage.getItem("userToken"); // Verificar si se guardó correctamente
            console.log("Token guardado en AsyncStorage:", savedToken); // Confirmación
        } catch (error) {
            console.error("Error al guardar la sesión:", error);
        }
    }

    static async getSession(): Promise<string | null> {
        try {
            console.log("Intentando recuperar el token desde AsyncStorage..."); // Mensaje inicial
            const token = await AsyncStorage.getItem("userToken");
            console.log("Token recuperado desde AsyncStorage:", token); // Confirmar el token recuperado
            return token;
        } catch (error) {
            console.error("Error al recuperar la sesión:", error);
            return null;
        }
    }

    static async clearSession(): Promise<void> {
        try {
            await AsyncStorage.removeItem("userToken");
        } catch (error) {
            console.error("Error clearing session:", error);
        }
    }
}
