// app/adapters/stores/authStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginUseCase } from "../../core/application/LoginUseCase";
import { User } from "../../core/domain/User";
import { AuthApiAdapter } from "../../core/infrastructure/AuthApiAdapter";
import { AuthService } from "../../core/infrastructure/AuthService";
import SessionStorage from "./SessionStorage";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loginWithCredentials: (email: string, password: string) => Promise<void>;
    registerWithCredentials: (data: {
        identificacion: string;
        primer_nombre: string;
        segundo_nombre: string;
        primer_apellido: string;
        segundo_apellido: string;
        correo: string;
        password: string;
        telefono: string;
        direccion: string;
    }) => Promise<void>;
    logout: () => void;
    refreshUserProfile: () => Promise<boolean>;
    // Métodos para acceder a datos específicos del usuario
    getUserId: () => string | undefined;
    getUserName: () => string;
    getUserEmail: () => string | undefined;
    getUserPhone: () => string | undefined;
    getUserAddress: () => string | undefined;
    getFullUserData: () => User | null;
    // Métodos específicos para la identificación
    getUserIdentificacion: () => string | undefined;
    saveIdentificacionToStorage: (identificacion: string) => Promise<void>;
    loadIdentificacionFromStorage: () => Promise<string | null>;
}

const loginUseCase = new LoginUseCase(new AuthApiAdapter());

// Función local para mostrar datos del usuario
const logUserData = (user: User | null, title: string = "DATOS DEL USUARIO"): void => {
    console.log(`\n=== ${title} ===`);

    if (!user) {
        console.log("❌ No hay datos de usuario disponibles");
        console.log("=== FIN ===\n");
        return;
    }

    console.log("👤 Información Personal:");
    console.log(`   ID: ${user.usuario_id ?? "No disponible"}`);
    console.log(`   Identificación: ${user.identificacion ?? "No disponible"}`);
    console.log(
        `   Nombre completo: ${user.primer_nombre} ${user.segundo_nombre ?? ""} ${
            user.primer_apellido
        } ${user.segundo_apellido ?? ""}`.trim()
    );

    console.log("\n📧 Contacto:");
    console.log(`   Email: ${user.correo ?? "No disponible"}`);
    console.log(`   Teléfono: ${user.telefono ?? "No disponible"}`);
    console.log(`   Dirección: ${user.direccion ?? "No disponible"}`);

    console.log("\n⚙️ Sistema:");
    console.log(`   Rol: ${user.rol ?? "No disponible"}`);
    console.log(`   Estado: ${user.activo ? "Activo" : "Inactivo"}`);
    console.log(
        `   Fecha creación: ${
            user.fecha_creacion
                ? new Date(user.fecha_creacion).toLocaleDateString()
                : "No disponible"
        }`
    );

    console.log(`=== FIN ${title} ===\n`);
};

const zustandStorageAdapter = {
    getItem: async (name: string) => {
        const value = await AsyncStorage.getItem(name);
        return value ? JSON.parse(value) : null;
    },
    setItem: async (name: string, value: any) => {
        await AsyncStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: async (name: string) => {
        await AsyncStorage.removeItem(name);
    },
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            loginWithCredentials: async (email, password) => {
                console.log("🚀 INICIANDO LOGIN...");
                const { user, token } = await loginUseCase.execute(email, password);
                console.log("📋 LOGIN COMPLETADO - Datos del usuario recibidos:", user);

                // DEBUGGING: Verificar identificación específicamente
                console.log("🆔 VERIFICACIÓN DE IDENTIFICACIÓN EN LOGIN:");
                console.log("   - user.identificacion:", user?.identificacion);
                console.log("   - user.usuario_id:", user?.usuario_id);
                console.log(
                    "   - Tiene identificación:",
                    !!(user?.identificacion && user.identificacion.trim() !== "")
                );

                // Verificar que los datos del usuario sean válidos
                if (user && Object.keys(user).length > 0 && user.primer_nombre) {
                    console.log("✅ Login exitoso! Datos del usuario guardados en AuthStore");

                    // Mostrar datos del usuario de forma organizada
                    logUserData(user, "LOGIN EXITOSO");

                    // Guardar identificación en localStorage de forma específica
                    if (user.identificacion && user.identificacion.trim() !== "") {
                        await SessionStorage.saveIdentificacion(user.identificacion);
                        console.log(
                            "🆔 Identificación guardada automáticamente en localStorage:",
                            user.identificacion
                        );
                    } else {
                        console.warn("⚠️ USUARIO SIN IDENTIFICACIÓN VÁLIDA");
                        console.warn("   Valor recibido:", user.identificacion);
                        // Usar identificación quemada como fallback si no hay identificación
                    }

                    set({ user, token, isAuthenticated: true });
                } else {
                    console.warn("⚠️ Datos del usuario incompletos o vacíos:", user);
                    // Aún así guardar el token para mantener la sesión
                    set({ user: user || null, token, isAuthenticated: true });
                }
            },
            registerWithCredentials: async (data) => {
                const { user, token } = await loginUseCase.executeRegister(data);

                // Verificar que los datos del usuario sean válidos
                if (user && Object.keys(user).length > 0 && user.primer_nombre) {
                    console.log("✅ Registro exitoso! Datos del usuario guardados en AuthStore");

                    // Mostrar datos del usuario de forma organizada
                    logUserData(user, "REGISTRO EXITOSO");

                    // Guardar identificación en localStorage de forma específica
                    if (user.identificacion && user.identificacion.trim() !== "") {
                        await SessionStorage.saveIdentificacion(user.identificacion);
                        console.log(
                            "🆔 Identificación guardada automáticamente en localStorage:",
                            user.identificacion
                        );
                    } else {
                        console.warn("⚠️ REGISTRO SIN IDENTIFICACIÓN VÁLIDA");
                    }

                    set({ user, token, isAuthenticated: true });
                } else {
                    console.warn("⚠️ Datos del usuario registrado incompletos o vacíos:", user);
                    // Aún así guardar el token para mantener la sesión
                    set({ user: user || null, token, isAuthenticated: true });
                }
            },
            logout: () => {
                console.log("Cerrando sesión y limpiando datos del usuario...");
                SessionStorage.clearSession(); // Limpiar también SessionStorage
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            refreshUserProfile: async (): Promise<boolean> => {
                try {
                    const currentState = get();
                    console.log("refreshUserProfile - Estado actual:", currentState);
                    if (!currentState.token) {
                        console.warn("No hay token para refrescar perfil");
                        return false;
                    }

                    console.log("Refrescando perfil del usuario...");
                    const profileData = await AuthService.getProfile(currentState.token);
                    console.log("refreshUserProfile - Datos del perfil:", profileData);

                    // DEBUGGING: Ver todos los campos disponibles en profileData
                    console.log("🔍 DEBUGGING - Campos disponibles en profileData:");
                    console.log("- id:", profileData.id);
                    console.log("- usuario_id:", profileData.usuario_id);
                    console.log("- identificacion:", profileData.identificacion);
                    console.log("- primer_nombre:", profileData.primer_nombre);
                    console.log("- primer_apellido:", profileData.primer_apellido);
                    console.log("- correo:", profileData.correo);
                    console.log("- telefono:", profileData.telefono);
                    console.log("- direccion:", profileData.direccion);
                    console.log("- rol:", profileData.rol);
                    console.log("🔍 FIN DEBUGGING\n");

                    const updatedUser: User = {
                        usuario_id: profileData.id?.toString(),
                        identificacion: profileData.identificacion ?? "",
                        primer_nombre: profileData.primer_nombre ?? "",
                        segundo_nombre: profileData.segundo_nombre ?? "",
                        primer_apellido: profileData.primer_apellido ?? "",
                        segundo_apellido: profileData.segundo_apellido ?? "",
                        correo: profileData.correo ?? "",
                        telefono: profileData.telefono ?? "",
                        direccion: profileData.direccion ?? "",
                        rol: currentState.user?.rol ?? "usuario_normal",
                        fecha_creacion:
                            currentState.user?.fecha_creacion ?? new Date().toISOString(),
                        activo: true,
                    };
                    console.log("📝 Perfil actualizado exitosamente");
                    logUserData(updatedUser, "PERFIL ACTUALIZADO");

                    // Guardar identificación actualizada en localStorage
                    if (updatedUser.identificacion && updatedUser.identificacion.trim() !== "") {
                        await SessionStorage.saveIdentificacion(updatedUser.identificacion);
                        console.log(
                            "🆔 Identificación actualizada en localStorage:",
                            updatedUser.identificacion
                        );
                    }

                    // Actualizar estado
                    set({ user: updatedUser });

                    // Actualizar SessionStorage
                    await SessionStorage.saveSession(currentState.token, updatedUser);

                    return true;
                } catch (error) {
                    console.error("Error al refrescar perfil:", error);
                    return false;
                }
            },

            // Métodos para acceder a datos específicos del usuario
            getUserId: () => {
                const id = get().user?.usuario_id;
                console.log("getUserId - usuario_id:", id);
                return typeof id === "string" && id.trim() !== "" ? id : undefined;
            },

            getUserName: () => {
                const user = get().user;
                if (!user) return "";
                const fullName = `${user.primer_nombre} ${user.segundo_nombre ?? ""} ${
                    user.primer_apellido
                } ${user.segundo_apellido ?? ""}`.trim();
                return fullName;
            },

            getUserEmail: () => get().user?.correo,

            getUserPhone: () => get().user?.telefono,

            getUserAddress: () => get().user?.direccion,

            getFullUserData: () => get().user,

            // Métodos específicos para la identificación
            getUserIdentificacion: () => {
                const identificacion = get().user?.identificacion;
                console.log("getUserIdentificacion - identificacion:", identificacion);
                return identificacion && identificacion.trim() !== "" ? identificacion : undefined;
            },

            saveIdentificacionToStorage: async (identificacion: string) => {
                try {
                    await SessionStorage.saveIdentificacion(identificacion);
                    console.log("✅ Identificación guardada en storage:", identificacion);
                } catch (error) {
                    console.error("❌ Error al guardar identificación en storage:", error);
                }
            },

            loadIdentificacionFromStorage: async (): Promise<string | null> => {
                try {
                    const identificacion = await SessionStorage.getIdentificacion();
                    console.log("🔍 Identificación cargada desde storage:", identificacion);
                    return identificacion;
                } catch (error) {
                    console.error("❌ Error al cargar identificación desde storage:", error);
                    return null;
                }
            },
        }),
        {
            name: "auth-storage", // clave para async-storage
            storage: zustandStorageAdapter, // adaptador compatible
            onRehydrateStorage: () => (state) => {
                if (!state) {
                    console.warn(
                        "No se pudo rehidratar el estado desde el almacenamiento persistente."
                    );
                } else {
                    console.log("Estado rehidratado exitosamente:", {
                        isAuthenticated: state.isAuthenticated,
                        hasUser: !!state.user,
                        hasToken: !!state.token,
                        userId: state.user?.usuario_id,
                        userName: state.user?.primer_nombre,
                    });
                }
            },
        }
    )
);
