import React, { useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";

interface OfertaCardProps {
    title: string;
    validUntil: string;
    image: string;
    tag: string;
    type: string;
    onPress: () => void;
}

export const OfertaCard = ({ title, validUntil, image, tag, type, onPress }: OfertaCardProps) => {
    const [imageLoading, setImageLoading] = useState(true);

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-xl overflow-hidden shadow-lg mr-4 w-64"
        >
            <View className="p-4 flex-row items-start">
                <View className="w-16 h-16 bg-gray-200 rounded-lg justify-center items-center">
                    <Image
                        source={{ uri: image }}
                        className="w-16 h-16 rounded-lg"
                        resizeMode="cover"
                        onLoadStart={() => setImageLoading(true)}
                        onLoadEnd={() => setImageLoading(false)}
                    />
                    {imageLoading && (
                        <ActivityIndicator size="small" color="#000" className="absolute" />
                    )}
                </View>
                <View className="flex-1 ml-3">
                    <View className="flex-row">
                        <View className="bg-blue-500 px-2 py-1 rounded-full mr-2">
                            <Text className="text-white text-xs">{type}</Text>
                        </View>
                        <View className="bg-pink-100 px-2 py-1 rounded-full">
                            <Text className="text-pink-800 text-xs">{tag}</Text>
                        </View>
                    </View>
                    <Text className="text-lg font-bold mt-2">{title}</Text>
                    <Text className="text-gray-600 text-sm">Válida hasta: {validUntil}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
