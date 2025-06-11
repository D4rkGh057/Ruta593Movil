import { Ionicons } from "@expo/vector-icons";
import "nativewind";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Boleto } from "../../core/domain/Boleto";
import { BoletoService } from "../../core/infrastructure/BoletoService";

export default function BoletosScreen() {
    const [boletos, setBoletos] = useState<Boleto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBoletos = async () => {
            try {
                const data = await BoletoService.getAllBoletos();
                setBoletos(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBoletos();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <Text className="text-lg font-bold">Cargando boletos...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 items-center justify-start bg-gray-100 p-5 relative">
            <TouchableOpacity className="absolute -top-12  right-5 z-10 " onPress={() => {
                setLoading(true);
                BoletoService.getAllBoletos()
                    .then(data => {
                        setBoletos(data);
                    })
                    .catch(error => {
                        console.error(error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
            }>
                <Ionicons name="refresh-outline" size={24} color="black" />
            </TouchableOpacity>
            {boletos.length > 0 ? (
                boletos.map((boleto) => (
                    <View key={boleto.boleto_id} className="w-full p-4 mb-4 bg-white rounded-lg shadow">
                        <Text className="text-lg font-bold">Boleto #{boleto.boleto_id}</Text>
                        <Text className="text-base text-gray-500">Estado: {boleto.estado}</Text>
                        <Text className="text-base text-gray-500">Fecha de emisión: {boleto.fecha_emision}</Text>
                        <Text className="text-base text-gray-500">Total: ${boleto.total}</Text>
                    </View>
                ))
            ) : (
                <>
                    <Image source={require("../../../assets/fantasma.png")} className="w-356 h-356 mb-5" />
                    <Text className="text-lg font-bold mb-2">No tienes viajes :(</Text>
                    <Text className="text-base text-gray-500 text-center mb-5">Los viajes que reserves aparecerán aquí</Text>
                    <TouchableOpacity className="bg-yellow-400 py-2 px-5 rounded-lg flex-row items-center gap-2">
                <Ionicons name="ticket" size={24} color="black" />
                <Text className="text-base font-bold text-black">Reservar ahora</Text>
            </TouchableOpacity>
                </>
            )}
        </View>
    );
}
