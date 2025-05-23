import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const [origen, setOrigen] = useState("Seleccionar origen");
    const [destino, setDestino] = useState("Seleccionar destino");

    const intercambiarUbicaciones = () => {
        const tempOrigen = origen;
        setOrigen(destino);
        setDestino(tempOrigen);
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

                    {/* Formulario de búsqueda */}
                    <View className="bg-white rounded-lg border border-gray-400 overflow-hidden mb-6">
                        {/* Campo Origen */}
                        <View className="p-4 border-b border-gray-400">
                            <Text className="text-gray-600 mb-1">Origen</Text>
                            <TouchableOpacity className="flex-row items-center justify-between">
                                <Text className="text-lg">{origen}</Text>
                                {/*<Ionicons name="chevron-down" size={24} color="black" />*/}
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
                            <TouchableOpacity className="flex-row items-center justify-between">
                                <Text className="text-lg">{destino}</Text>
                                {/*<Ionicons name="chevron-down" size={24} color="black" />*/}
                            </TouchableOpacity>
                        </View>

                        {/* Fecha de ida */}
                        <View className="p-4 border-b border-gray-400">
                            <Text className="text-gray-600 mb-1">Fecha de ida</Text>
                            <View className="flex-row items-center">
                                <Text className="text-lg mr-4">vie-11-abr</Text>
                                <View className="flex-row space-x-2">
                                    <TouchableOpacity className="bg-yellow-400 px-4 py-1 rounded-full">
                                        <Text>Hoy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="bg-yellow-400 px-4 py-1 rounded-full">
                                        <Text>Mañana</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Fecha de retorno */}
                        <View className="p-4">
                            <Text className="text-gray-600 mb-1">Fecha de retorno(Opcional)</Text>
                            <TouchableOpacity className="flex-row items-center justify-between">
                                <Text className="text-lg">Seleccionar fecha</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Botón de búsqueda */}
                    <TouchableOpacity className="bg-yellow-400 p-4 rounded-full flex-row items-center justify-center mb-6">
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
