import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <View className="w-full justify-center mt-8">
        <View className="ml-12">
        <Image
          source={require('../assets/images/ruta593.png')}
          style={{ width: 280, height: 93 }}
        />
      </View>
        <Text className="text-base font-bold text-black mt-2 text-center">
          Viajes Óptimos, Horarios Útiles y Eficientes
        </Text>
      </View>
      <View className="flex-1 justify-center items-center w-full">
        <Image
          source={require('../assets/images/mountain.png')}
          style={{ width: 220, height: 95, resizeMode: 'contain' }}
        />
      </View>
      <TouchableOpacity
        className="w-full max-w-xs bg-yellow-300 rounded-xl py-4 mb-12 items-center"
        onPress={() => console.log('Reservar Ya')}
        activeOpacity={0.8}
      >
        <Text className="text-black text-lg font-bold">Reservar Ya</Text>
      </TouchableOpacity>
    </View>
  );
}
