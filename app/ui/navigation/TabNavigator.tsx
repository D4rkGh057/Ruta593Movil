import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AyudaScreen from '../screens/AyudaScreen';
import BoletosScreen from '../screens/BoletosScreen';
import HomeScreen from '../screens/HomeScreen';
import OfertasScreen from '../screens/OfertasScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#0066CC',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: {
                    fontSize: 12,
                },
                tabBarStyle: {
                    paddingBottom: insets.bottom || (Platform.OS === 'android' ? 8 : 20),
                    height: 60 + (insets.bottom || 0),
                    position: 'absolute',
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderTopColor: '#e5e5e5',
                },
                headerShown: false,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tab.Screen
                name="Inicio"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Boletos"
                component={BoletosScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ticket-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Ofertas"
                component={OfertasScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="pricetag-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Ayuda"
                component={AyudaScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="help-circle-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Mi perfil"
                component={PerfilScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}