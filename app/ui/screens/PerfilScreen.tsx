import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PerfilScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-2xl font-bold">Mi Perfil</Text>
                <Text className="text-gray-600 mt-2">Gestiona tu información personal</Text>
            </View>
        </SafeAreaView>
    );
} 