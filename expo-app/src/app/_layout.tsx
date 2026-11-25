import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "@/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="light" />
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
