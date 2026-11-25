import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { PlayfairDisplay_600SemiBold } from "@expo-google-fonts/playfair-display/600SemiBold";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display/700Bold";
import { AppProvider } from "@/AppContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts([
    {
      fontFamily: "Inter",
      fontDefinitions: [
        { path: Inter_400Regular, weight: 400 },
        { path: Inter_500Medium, weight: 500 },
        { path: Inter_600SemiBold, weight: 600 },
        { path: Inter_700Bold, weight: 700 },
      ],
    },
    {
      fontFamily: "Playfair Display",
      fontDefinitions: [
        { path: PlayfairDisplay_600SemiBold, weight: 600 },
        { path: PlayfairDisplay_700Bold, weight: 700 },
      ],
    },
  ]);

  if (!fontsLoaded) return null;

  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="editor"
          options={{ headerShown: true, title: "Content studio", presentation: "modal" }}
        />
        <Stack.Screen name="stop/[id]" options={{ headerShown: true, title: "Stop details" }} />
        <Stack.Screen name="spot/[id]" options={{ headerShown: true, title: "Detail" }} />
      </Stack>
    </AppProvider>
  );
}
