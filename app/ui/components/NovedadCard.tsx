import React, { useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";

interface NovedadCardProps {
    title: string;
    subtitle: string;
    image: string;
    onPress: () => void;
}

export const NovedadCard = ({ title, subtitle, image, onPress }: NovedadCardProps) => {
    const [imageLoading, setImageLoading] = useState(true);

    return (
        <View className="flex-row bg-white rounded-xl overflow-hidden shadow-lg mb-4">
            <View className="w-40 h-32 bg-gray-200 justify-center items-center">
                <Image
                    source={{ uri: image }}
                    className="w-40 h-32"
                    resizeMode="cover"
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                />
                {imageLoading && (
                    <ActivityIndicator size="large" color="#000" className="absolute" />
                )}
            </View>
            <View className="flex-1 p-4 justify-between">
                <View>
                    <Text className="text-xl font-bold mb-2">{title}</Text>
                    <Text className="text-gray-600">{subtitle}</Text>
                </View>
                <TouchableOpacity
                    onPress={onPress}
                    className="bg-pink-100 self-start px-4 py-2 rounded-full"
                >
                    <Text className="text-pink-800">Saber más</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
