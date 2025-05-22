import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "../global.css";
export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    'MyCustomFont-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; // or a loading indicator
  }

  return <Stack screenOptions={
    {
      headerShown: false,
    }
  }/>;
}
