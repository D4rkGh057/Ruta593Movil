import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
            <View className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full items-center">
                <Text className="text-3xl font-bold text-gray-800 mb-4">¡Bienvenido!</Text>
                <Text className="text-gray-600 mb-6 text-center">
                    Gracias por usar nuestra aplicación. Esperamos que tengas una excelente experiencia.
                </Text>
                <TouchableOpacity className="px-6 py-2 bg-blue-600 rounded-lg">
                    <Text className="text-white font-semibold">Comenzar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
