import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CenteredInfoScreenProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

const CenteredInfoScreen: React.FC<CenteredInfoScreenProps> = ({ title, subtitle, children }) => (
    <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-4">
            <Text className="text-2xl font-bold">{title}</Text>
            <Text className="text-gray-600 mt-2">{subtitle}</Text>
            {children && <View className="mt-4">{children}</View>}
        </View>
    </SafeAreaView>
);

export default CenteredInfoScreen;
