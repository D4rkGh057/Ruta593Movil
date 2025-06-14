import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuthStore } from "../../adapters/stores/authStore";

export default function RegisterScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const registerWithCredentials = useAuthStore((state) => state.registerWithCredentials);

    const [identificacion, setIdentificacion] = useState("");
    const [primerNombre, setPrimerNombre] = useState("");
    const [segundoNombre, setSegundoNombre] = useState("");
    const [primerApellido, setPrimerApellido] = useState("");
    const [segundoApellido, setSegundoApellido] = useState("");
    const [telefono, setTelefono] = useState("");
    const [direccion, setDireccion] = useState("");

    const handleRegister = async () => {
        setError(null);
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        try {
            await registerWithCredentials({
                identificacion,
                primer_nombre: primerNombre,
                segundo_nombre: segundoNombre,
                primer_apellido: primerApellido,
                segundo_apellido: segundoApellido,
                correo: email,
                password,
                telefono,
                direccion,
            });
            router.replace("/login");
        } catch (e: any) {
            setError(e.message ?? "Error al registrarse");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "android" ? "height" : "padding"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 justify-center items-center p-5 bg-white">
                    <Image
                        source={require("../../../assets/images/mountain.png")}
                        className="w-280 h-93 mb-12"
                    />
                    <Image
                        source={require("../../../assets/images/ruta593.png")}
                        className="w-280 h-93 mb-4"
                    />
                    <Text
                        style={{ fontFamily: "Inter" }}
                        className="text-base text-black mb-8 text-center"
                    >
                        Viajes Óptimos, Horarios Útiles y Eficientes
                    </Text>
                    {error && <Text className="text-red-500 mb-2">{error}</Text>}
                    <TextInput
                        className="w-80 h-14 border border-gray-300 rounded-xl p-4 mb-2 text-black"
                        placeholder="Correo"
                        placeholderTextColor="#9ca3af"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <View className="relative w-80">
                        <TextInput
                            className="h-14 border border-gray-300 rounded-xl p-4 mb-2 text-black"
                            placeholder="Contraseña"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Feather
                                name={showPassword ? "eye" : "eye-off"}
                                size={20}
                                color="#6b7280"
                            />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        className="w-80 h-14 border border-gray-300 rounded-xl p-4 mb-2 text-black"
                        placeholder="Confirma tu Contraseña"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry={!showPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TextInput
                        className="w-80 h-14 border border-gray-300 rounded-xl p-4 mb-2 text-black"
                        placeholder="Identificación"
                        placeholderTextColor="#9ca3af"
                        value={identificacion}
                        onChangeText={setIdentificacion}
                    />
                    <TextInput
                        className="w-80 h-14 border border-gray-300 rounded-xl p-4 mb-2 text-black"
                        placeholder="Primer Nombre"
                        placeholderTextColor="#9ca3af"
                        value={primerNombre}
                        onChangeText={setPrimerNombre}
                    />
                    <TextInput
                        className="w-80 h-14 border border-gray-300 rounded-xl p-4 mb-2 text-black"
                        placeholder="Segundo Nombre"
                        placeholderTextColor="#9ca3af"
                        value={segundoNombre}
                        onChangeText={setSegundoNombre}
                    />
                    <TextInput
                        className="w-80 h-14 border border-gray-300 rounded-xl p-4 mb-2 text-black"
                        placeholder="Primer Apellido"
                        placeholderTextColor="#9ca3af"
                        value={primerApellido}
                        onChangeText={setPrimerApellido}
                    />
                    <TextInput
                        className="w-80 h-14 border border-gray-300 rounded-xl p-4 mb-2 text-black"
                        placeholder="Segundo Apellido"
                        placeholderTextColor="#9ca3af"
                        value={segundoApellido}
                        onChangeText={setSegundoApellido}
                    />
                    <TextInput
                        className="w-80 h-14 border border-gray-300 rounded-xl p-4 mb-2 text-black"
                        placeholder="Teléfono"
                        placeholderTextColor="#9ca3af"
                        value={telefono}
                        onChangeText={setTelefono}
                    />
                    <TextInput
                        className="w-80 h-14 border border-gray-300 rounded-xl p-4 mb-2 text-black"
                        placeholder="Dirección"
                        placeholderTextColor="#9ca3af"
                        value={direccion}
                        onChangeText={setDireccion}
                    />
                    <TouchableOpacity
                        className="w-56 h-14 bg-yellow-400 justify-center items-center rounded-xl mb-5"
                        onPress={handleRegister}
                    >
                        <Text className="text-black" style={{ fontFamily: "Inter" }}>
                            Registrarse
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="mt-5" onPress={() => router.push("/login")}>
                        <Text className="text-blue-800" style={{ fontFamily: "Inter" }}>
                            ¿Ya tienes una cuenta? Inicia Sesión
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
