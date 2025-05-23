import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const [origen, setOrigen] = useState("Seleccionar origen");
    const [destino, setDestino] = useState("Seleccionar destino");
    const [fechaIda, setFechaIda] = useState(new Date());
    const [fechaRetorno, setFechaRetorno] = useState<Date | null>(null);
    const [showDatePickerIda, setShowDatePickerIda] = useState(false);
    const [showDatePickerRetorno, setShowDatePickerRetorno] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const intercambiarUbicaciones = () => {
        // Validar que ambos campos tengan valores seleccionados
        if (origen === "Seleccionar origen" || destino === "Seleccionar destino") {
            Alert.alert(
                "Error",
                "Debes seleccionar tanto el origen como el destino antes de intercambiarlos",
                [{ text: "Entendido" }]
            );
            return;
        }

        const tempOrigen = origen;
        setOrigen(destino);
        setDestino(tempOrigen);
    };

    const formatearFecha = (fecha: Date | null) => {
        if (!fecha) return "Seleccionar fecha";

        const dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
        const meses = [
            "ene",
            "feb",
            "mar",
            "abr",
            "may",
            "jun",
            "jul",
            "ago",
            "sep",
            "oct",
            "nov",
            "dic",
        ];

        return `${dias[fecha.getDay()]}-${fecha.getDate()}-${meses[fecha.getMonth()]}`;
    };

    const onChangeFechaIda = (event: any, selectedDate?: Date) => {
        setShowDatePickerIda(Platform.OS === "ios");
        if (selectedDate) {
            // Validar que la fecha no sea anterior al día actual
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                Alert.alert(
                    "Fecha inválida",
                    "No puedes seleccionar una fecha anterior al día de hoy",
                    [{ text: "Entendido" }]
                );
                return;
            }

            setFechaIda(selectedDate);

            // Si hay fecha de retorno y es anterior a la nueva fecha de ida, limpiarla
            if (fechaRetorno && selectedDate > fechaRetorno) {
                setFechaRetorno(null);
            }
        }
    };

    const onChangeFechaRetorno = (event: any, selectedDate?: Date) => {
        setShowDatePickerRetorno(Platform.OS === "ios");
        if (selectedDate) {
            // Validar que la fecha de retorno no sea anterior a la de ida
            if (selectedDate < fechaIda) {
                Alert.alert(
                    "Fecha inválida",
                    "La fecha de retorno no puede ser anterior a la fecha de ida",
                    [{ text: "Entendido" }]
                );
                return;
            }
            setFechaRetorno(selectedDate);
        }
    };

    const setHoy = () => {
        const hoy = new Date();
        setFechaIda(hoy);

        // Si hay fecha de retorno y es anterior a hoy, limpiarla
        if (fechaRetorno && hoy > fechaRetorno) {
            setFechaRetorno(null);
        }
    };

    const setMañana = () => {
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        setFechaIda(mañana);

        // Si hay fecha de retorno y es anterior a mañana, limpiarla
        if (fechaRetorno && mañana > fechaRetorno) {
            setFechaRetorno(null);
        }
    };

    const validarBusqueda = () => {
        // Validar origen y destino
        if (origen === "Seleccionar origen" || destino === "Seleccionar destino") {
            Alert.alert("Campos requeridos", "Debes seleccionar tanto el origen como el destino", [
                { text: "Entendido" },
            ]);
            return false;
        }

        // Validar que origen y destino sean diferentes
        if (origen === destino) {
            Alert.alert("Error en rutas", "El origen y el destino no pueden ser iguales", [
                { text: "Entendido" },
            ]);
            return false;
        }

        // Validar fecha de ida (ya está validada en el picker)

        return true;
    };

    const handleBuscarBuses = () => {
        setError(null);

        if (!validarBusqueda()) {
            return;
        }

        // Aquí iría la lógica para buscar buses
        Alert.alert(
            "Búsqueda exitosa",
            `Buses encontrados para:\nOrigen: ${origen}\nDestino: ${destino}\nFecha: ${formatearFecha(
                fechaIda
            )}`,
            [{ text: "Continuar" }]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <ScrollView className="flex-1">
                <View className="p-4">
                    {/* Encabezado */}
                    <View className="mb-4">
                        <Text className="text-3xl font-bold mb-1">Pasaje de bus</Text>
                        <Text className="text-gray-600 text-lg">
                            Pagos seguros, descuentos especiales
                        </Text>
                    </View>

                    {/* Mostrar error si existe */}
                    {error && (
                        <View className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <Text className="text-red-700">{error}</Text>
                        </View>
                    )}

                    {/* Formulario de búsqueda */}
                    <View className="bg-white rounded-lg border border-gray-400 overflow-hidden mb-6">
                        {/* Campo Origen */}
                        <View className="p-4 border-b border-gray-400">
                            <Text className="text-gray-600 mb-1">Origen</Text>
                            <TouchableOpacity
                                className="flex-row items-center justify-between"
                                onPress={() =>
                                    Alert.alert(
                                        "Seleccionar origen",
                                        "Aquí iría el selector de origen"
                                    )
                                }
                            >
                                <Text
                                    className={`text-lg ${
                                        origen === "Seleccionar origen"
                                            ? "text-gray-400"
                                            : "text-black"
                                    }`}
                                >
                                    {origen}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Botón de intercambio */}
                        <View className="absolute right-14 top-16 z-10">
                            <TouchableOpacity
                                onPress={intercambiarUbicaciones}
                                className="bg-black rounded-full p-2"
                            >
                                <Ionicons name="swap-vertical" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Campo Destino */}
                        <View className="p-4 border-b border-gray-400">
                            <Text className="text-gray-600 mb-1">Destino</Text>
                            <TouchableOpacity
                                className="flex-row items-center justify-between"
                                onPress={() =>
                                    Alert.alert(
                                        "Seleccionar destino",
                                        "Aquí iría el selector de destino"
                                    )
                                }
                            >
                                <Text
                                    className={`text-lg ${
                                        destino === "Seleccionar destino"
                                            ? "text-gray-400"
                                            : "text-black"
                                    }`}
                                >
                                    {destino}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Fecha de ida */}
                        <View className="p-4 border-b border-gray-400">
                            <Text className="text-gray-600 mb-1">Fecha de ida</Text>
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    onPress={() => setShowDatePickerIda(true)}
                                    className="mr-4"
                                >
                                    <Text className="text-lg">{formatearFecha(fechaIda)}</Text>
                                </TouchableOpacity>
                                <View className="flex-row space-x-2">
                                    <TouchableOpacity
                                        className={`px-4 py-1 rounded-full ${
                                            formatearFecha(fechaIda) === formatearFecha(new Date())
                                                ? "bg-yellow-500"
                                                : "bg-yellow-200"
                                        }`}
                                        onPress={setHoy}
                                    >
                                        <Text>Hoy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className={`px-4 py-1 rounded-full ${
                                            formatearFecha(fechaIda) ===
                                            formatearFecha(
                                                new Date(
                                                    new Date().setDate(new Date().getDate() + 1)
                                                )
                                            )
                                                ? "bg-yellow-500"
                                                : "bg-yellow-200"
                                        }`}
                                        onPress={setMañana}
                                    >
                                        <Text>Mañana</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Fecha de retorno */}
                        <View className="p-4">
                            <Text className="text-gray-600 mb-1">Fecha de retorno (Opcional)</Text>
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    className="flex-row items-center justify-between mr-4"
                                    onPress={() => setShowDatePickerRetorno(true)}
                                >
                                    <Text
                                        className={`text-lg ${
                                            !fechaRetorno ? "text-gray-400" : "text-black"
                                        }`}
                                    >
                                        {formatearFecha(fechaRetorno)}
                                    </Text>
                                </TouchableOpacity>
                                {fechaRetorno && (
                                    <View className="flex-row space-x-2">
                                        <TouchableOpacity
                                            className="bg-red-400 px-4 py-1 rounded-full"
                                            onPress={() => setFechaRetorno(null)}
                                        >
                                            <Text className="text-white">Eliminar</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* DatePicker para fecha de ida */}
                    {showDatePickerIda && (
                        <DateTimePicker
                            value={fechaIda}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={onChangeFechaIda}
                            minimumDate={new Date()}
                        />
                    )}

                    {/* DatePicker para fecha de retorno */}
                    {showDatePickerRetorno && (
                        <DateTimePicker
                            value={fechaRetorno || new Date()}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={onChangeFechaRetorno}
                            minimumDate={fechaIda}
                        />
                    )}

                    {/* Botón de búsqueda */}
                    <TouchableOpacity
                        className="bg-yellow-400 p-4 rounded-full flex-row items-center justify-center mb-6"
                        onPress={handleBuscarBuses}
                    >
                        <Ionicons name="search" size={24} color="black" className="mr-2" />
                        <Text className="text-lg font-semibold">Buscar buses</Text>
                    </TouchableOpacity>

                    {/* Sección Novedades */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold mb-4">Novedades</Text>
                        <View className="bg-white rounded-lg overflow-hidden shadow">
                            {/* Aquí puedes agregar una imagen o contenido para novedades */}
                        </View>
                    </View>

                    {/* Sección Ofertas */}
                    <View>
                        <Text className="text-2xl font-bold mb-4">Ofertas</Text>
                        <View className="bg-white rounded-lg overflow-hidden shadow">
                            {/* Aquí puedes agregar una imagen o contenido para ofertas */}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
