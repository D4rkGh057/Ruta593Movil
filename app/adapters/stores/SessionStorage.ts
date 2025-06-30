import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../../core/domain/User";

interface SessionData {
    token: string;
    user: User;
}

// Interfaz para búsquedas recientes
interface BusquedaReciente {
    id: string;
    origen: string;
    destino: string;
    fecha: string;
    cantidadResultados: number;
    fechaBusqueda: string;
}

export default class SessionStorage {    static async saveSession(token: string, user?: User): Promise<void> {
        try {
            console.log("Intentando guardar la sesión en AsyncStorage...");
            
            // Guardar el token
            await AsyncStorage.setItem("userToken", token);
            console.log("Token guardado:", token);
              // Guardar los datos del usuario si se proporcionan y no están vacíos
            if (user && Object.keys(user).length > 0) {
                await AsyncStorage.setItem("userData", JSON.stringify(user));
                console.log("💾 Datos del usuario guardados en AsyncStorage:", {
                    id: user.usuario_id,
                    nombre: user.primer_nombre,
                    apellido: user.primer_apellido,
                    correo: user.correo,
                    telefono: user.telefono,
                    direccion: user.direccion
                });
                
                // Guardar identificación por separado para fácil acceso
                if (user.identificacion && user.identificacion.trim() !== '') {
                    await this.saveIdentificacion(user.identificacion);
                }
                
                // Guardar sesión completa como objeto
                const sessionData: SessionData = { token, user };
                await AsyncStorage.setItem("userSession", JSON.stringify(sessionData));
            } else {
                console.warn("⚠️ No se proporcionaron datos de usuario válidos para guardar");
                
                // Guardar solo el token en la sesión
                const sessionData: SessionData = { token, user: {} as User };
                await AsyncStorage.setItem("userSession", JSON.stringify(sessionData));
            }
            
            console.log("Sesión completa guardada exitosamente");
        } catch (error) {
            console.error("Error al guardar la sesión:", error);
        }
    }static async getSession(): Promise<string | null> {
        try {
            console.log("Intentando recuperar el token desde AsyncStorage...");
            const token = await AsyncStorage.getItem("userToken");
            console.log("Token recuperado desde AsyncStorage:", token);
            return token;
        } catch (error) {
            console.error("Error al recuperar la sesión:", error);
            return null;
        }
    }

    static async getUserData(): Promise<User | null> {
        try {
            console.log("Intentando recuperar datos del usuario desde AsyncStorage...");
            const userData = await AsyncStorage.getItem("userData");
            if (userData) {
                const user = JSON.parse(userData) as User;
                console.log("Datos del usuario recuperados:", {
                    id: user.usuario_id,
                    nombre: user.primer_nombre,
                    apellido: user.primer_apellido,
                    correo: user.correo
                });
                return user;
            }
            return null;
        } catch (error) {
            console.error("Error al recuperar los datos del usuario:", error);
            return null;
        }
    }

    static async getCompleteSession(): Promise<SessionData | null> {
        try {
            console.log("Intentando recuperar sesión completa desde AsyncStorage...");
            const sessionData = await AsyncStorage.getItem("userSession");
            if (sessionData) {
                const session = JSON.parse(sessionData) as SessionData;
                console.log("Sesión completa recuperada:", {
                    hasToken: !!session.token,
                    userId: session.user?.usuario_id,
                    userName: session.user?.primer_nombre
                });
                return session;
            }
            return null;
        } catch (error) {
            console.error("Error al recuperar la sesión completa:", error);
            return null;
        }
    }    static async clearSession(): Promise<void> {
        try {
            console.log("Limpiando sesión completa...");
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userData");
            await AsyncStorage.removeItem("userSession");
            await AsyncStorage.removeItem("userIdentificacion"); // Limpiar identificación
            console.log("Sesión limpiada exitosamente");
        } catch (error) {
            console.error("Error al limpiar la sesión:", error);
        }
    }

    // Métodos específicos para manejar la identificación del usuario
    static async saveIdentificacion(identificacion: string): Promise<void> {
        try {
            console.log("💾 Guardando identificación del usuario:", identificacion);
            await AsyncStorage.setItem("userIdentificacion", identificacion);
            console.log("✅ Identificación guardada exitosamente en AsyncStorage");
        } catch (error) {
            console.error("❌ Error al guardar la identificación:", error);
        }
    }

    static async getIdentificacion(): Promise<string | null> {
        try {
            console.log("🔍 Recuperando identificación del usuario desde AsyncStorage...");
            const identificacion = await AsyncStorage.getItem("userIdentificacion");
            console.log("📄 Identificación recuperada:", identificacion);
            return identificacion;
        } catch (error) {
            console.error("❌ Error al recuperar la identificación:", error);
            return null;
        }
    }

    static async clearIdentificacion(): Promise<void> {
        try {
            console.log("🗑️ Limpiando identificación del usuario...");
            await AsyncStorage.removeItem("userIdentificacion");
            console.log("✅ Identificación limpiada exitosamente");
        } catch (error) {
            console.error("❌ Error al limpiar la identificación:", error);
        }
    }

    // Funciones para manejar búsquedas recientes
    static async saveBusquedaReciente(origen: string, destino: string, fecha: Date, cantidadResultados: number): Promise<void> {
        try {
            console.log("💾 Guardando búsqueda reciente...");
            
            const busqueda: BusquedaReciente = {
                id: Date.now().toString(),
                origen,
                destino,
                fecha: fecha.toISOString(),
                cantidadResultados,
                fechaBusqueda: new Date().toISOString()
            };

            // Obtener búsquedas existentes
            const busquedasExistentes = await this.getBusquedasRecientes();
            console.log(`📝 Búsquedas existentes: ${busquedasExistentes.length}`);
            
            // Verificar si ya existe una búsqueda similar reciente (mismo origen y destino)
            const busquedasFiltradas = busquedasExistentes.filter(
                b => !(b.origen === origen && b.destino === destino)
            );
            console.log(`🔍 Después de filtrar duplicados: ${busquedasFiltradas.length}`);
            
            // Agregar la nueva búsqueda al inicio
            const nuevasBusquedas = [busqueda, ...busquedasFiltradas];
            console.log(`➕ Con nueva búsqueda: ${nuevasBusquedas.length}`);
            
            // Mantener solo las últimas 5 búsquedas (eliminar las más antiguas automáticamente)
            const busquedasLimitadas = nuevasBusquedas.slice(0, 5);
            console.log(`✂️ Limitadas a 5: ${busquedasLimitadas.length} búsquedas guardadas`);
            
            if (nuevasBusquedas.length > 5) {
                console.log(`🗑️ Se eliminaron ${nuevasBusquedas.length - 5} búsquedas antiguas automáticamente`);
            }
            
            await AsyncStorage.setItem("busquedasRecientes", JSON.stringify(busquedasLimitadas));
            console.log("✅ Búsqueda reciente guardada:", busqueda);
        } catch (error) {
            console.error("❌ Error al guardar búsqueda reciente:", error);
        }
    }

    static async getBusquedasRecientes(): Promise<BusquedaReciente[]> {
        try {
            console.log("🔍 Recuperando búsquedas recientes...");
            const busquedasJson = await AsyncStorage.getItem("busquedasRecientes");
            const busquedas = busquedasJson ? JSON.parse(busquedasJson) : [];
            console.log("📋 Búsquedas recientes recuperadas:", busquedas.length);
            return busquedas;
        } catch (error) {
            console.error("❌ Error al recuperar búsquedas recientes:", error);
            return [];
        }
    }

    static async clearBusquedasRecientes(): Promise<void> {
        try {
            console.log("🗑️ Limpiando búsquedas recientes...");
            await AsyncStorage.removeItem("busquedasRecientes");
            console.log("✅ Búsquedas recientes limpiadas");
        } catch (error) {
            console.error("❌ Error al limpiar búsquedas recientes:", error);
        }
    }
}
