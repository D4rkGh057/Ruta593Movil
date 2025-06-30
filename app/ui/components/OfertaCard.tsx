import React, { useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { Descuento } from "../../core/domain/Descuento";

interface OfertaCardProps {
    descuento: Descuento;
    onPress: () => void;
}

export const OfertaCard = ({ descuento, onPress }: OfertaCardProps) => {
    const [imageLoading, setImageLoading] = useState(true);

    // Función para formatear el porcentaje
    const formatearPorcentaje = (porcentaje: number | string): string => {
        const num = typeof porcentaje === 'string' ? parseFloat(porcentaje) : porcentaje;
        return `${num}%`;
    };

    // Función para formatear las fechas
    const formatearFecha = (fechaString: string): string => {
        try {
            const fecha = new Date(fechaString);
            
            // Verificar si la fecha es válida
            if (isNaN(fecha.getTime())) {
                return fechaString; // Retornar la fecha original si no es válida
            }

            const meses = [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ];

            const dia = fecha.getDate();
            const mes = meses[fecha.getMonth()];
            const año = fecha.getFullYear();

            return `${dia} ${mes} ${año}`;
        } catch (error) {
            // En caso de error, retornar la fecha original
            return fechaString;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-xl overflow-hidden shadow-lg mr-4 w-80"
        >
            <View className="p-4 flex-row items-start">
                <View className="w-40 h-40 bg-gray-200 rounded-lg justify-center items-center">
                    {descuento.link_descarga ? (
                        <Image
                            source={{ uri: descuento.link_descarga }}
                            className="w-40 h-40 rounded-lg"
                            onLoadStart={() => setImageLoading(true)}
                            onLoadEnd={() => setImageLoading(false)}
                        />
                    ) : (
                        <Text className="text-gray-500 text-xs text-center">Sin imagen</Text>
                    )}
                    {imageLoading && descuento.link_descarga && (
                        <ActivityIndicator size="small" color="#000" className="absolute" />
                    )}
                </View>
                <View className="flex-1 ml-3">
                    <View className="flex-row">
                        <View className="bg-green-500 px-2 py-1 rounded-full mr-2">
                            <Text className="text-white text-xs font-semibold">
                                {formatearPorcentaje(descuento.porcentaje)} OFF
                            </Text>
                        </View>
                        {descuento.activo && (
                            <View className="bg-blue-100 px-2 py-1 rounded-full">
                                <Text className="text-blue-800 text-xs">Activo</Text>
                            </View>
                        )}
                    </View>
                    <Text className="text-lg font-bold mt-2">{descuento.nombre}</Text>
                    <Text className="text-gray-600 text-sm mb-1">Válida hasta: {formatearFecha(descuento.vida_util)}</Text>
                    <Text className="text-gray-500 text-xs">{descuento.mensaje}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
           
