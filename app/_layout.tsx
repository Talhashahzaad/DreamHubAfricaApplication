
import { Inter_400Regular, Inter_600SemiBold, useFonts } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, SplashScreen, Stack, useRootNavigationState, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import NetworkProvider from "../src/NetworkProvider";
import "./globals.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        setToken(savedToken);
      } catch (e) {
        console.log("Error fetching token:", e);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || loading || !navigationState?.key) {
    return null; // Wait until fonts, token, and navigation are ready
  }

  // 🚀 Auth Guard Logic
  const currentSegment = segments[0] ?? "";

  // If user is logged in and tries to access sign-in or sign-up → redirect to profile
  if (token && (currentSegment === "sign-in" || currentSegment === "sign-up")) {
    return <Redirect href="/(root)/(tabs)/profile" />;
  }

  // If not logged in and tries to access profile → redirect to sign-in
  if (!token && currentSegment === "profile") {
    return <Redirect href="/sign-in" />;
  }

  // Default stack
  return (
    <NetworkProvider>
      return <Stack screenOptions={{ headerShown: false }} />;
    </NetworkProvider>
  );
}


