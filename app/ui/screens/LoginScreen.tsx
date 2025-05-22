import React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {

  return (
    <View className="flex-1 justify-center items-center p-5 bg-white">
      <Image source={require('../../../assets/images/ruta593.png')} className="w-280 h-93 mb-12" />
      <Image source={require('../../../assets/images/mountain.png')} className="w-280 h-93 mb-12" />
      <TextInput className="w-full h-12 border border-gray-300 rounded p-2 mb-2 bg-gray-100" placeholder="Ingresa tu Correo" />
      <TextInput className="w-full h-12 border border-gray-300 rounded p-2 mb-2 bg-gray-100" placeholder="Ingresa tu Contraseña" secureTextEntry />
      <TouchableOpacity className="self-end mb-5">
        <Text className="text-blue-500">¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity className="w-full h-12 bg-yellow-400 justify-center items-center rounded mb-5">
        <Text className="text-black font-bold">Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-5">
        <Text className="text-blue-500">¿Aún no te registras? Crea una Cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}
