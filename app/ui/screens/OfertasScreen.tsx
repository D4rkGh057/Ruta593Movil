import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OfertasScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-2xl font-bold">Ofertas</Text>
                <Text className="text-gray-600 mt-2">Descubre nuestras mejores promociones</Text>
            </View>
        </SafeAreaView>
    );
} 