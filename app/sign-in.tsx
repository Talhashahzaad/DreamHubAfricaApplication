

import Constants from "expo-constants";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { clearToken, setToken } from "./lib/auth"; // adjust path

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? "https://api.dreamhubafrica.com";


const SignIn = () => {
    const router = useRouter();
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!emailOrPhone || !password) {
            Alert.alert("Error", "Please enter email/phone and password");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailOrPhone, password }),
            });

            const data = await response.json();

            const token =
                data?.token || data?.accessToken || data?.data?.token || null;

            if (response.ok && token) {
                await setToken(token); // use helper
                // optional: verify token shape before navigating
                router.replace("/(root)/(tabs)/profile");

            }
            else {
                const message =
                    data?.message ||
                    data?.error ||
                    `Login failed (${response.status}). Check credentials.`;
                Alert.alert("Login Failed", message);
            }
        } catch (err) {
            console.error("Login error:", err);
            Alert.alert("Error", "Something went wrong, please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGuest = async () => {
        await clearToken();
        router.replace("/(root)/(tabs)/explore");
    };
    return (
        <SafeAreaView className="flex-1 bg-[#D7A73D] px-5">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{ alignItems: "center", paddingVertical: 20 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo */}
                    <Image
                        source={require("../assets/images/logo.png")}
                        className="w-[250px] h-[250px]"
                        resizeMode="contain"
                    />

                    {/* Title */}
                    <Text className="text-[42px] font-bold text-[#333] mb-10">
                        Welcome Back!
                    </Text>

                    {/* Email Input */}
                    <TextInput
                        placeholder="Email or Phone"
                        placeholderTextColor="#333"
                        value={emailOrPhone}
                        onChangeText={setEmailOrPhone}
                        className="w-full h-[50px] border border-[#ddd] rounded-lg px-4 mb-4 text-base bg-[#fff5b8]"
                    />

                    {/* Password Input */}
                    <TextInput
                        placeholder="Password"
                        secureTextEntry
                        placeholderTextColor="#333"
                        value={password}
                        onChangeText={setPassword}
                        className="w-full h-[50px] border border-[#ddd] rounded-lg px-4 mb-4 text-base bg-[#fff5b8]"
                    />

                    {/* Login Button */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className="w-full bg-[#123d22] p-4 rounded-lg items-center mb-4"
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white text-lg">Log In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Register Link */}
                    <TouchableOpacity>
                        <Text className="text-[#123d22] text-base mb-5">
                            {"Don't have an account?"} <Link href="/sign-up" className=" font-semibold">Register</Link>
                        </Text>
                        <Text className="text-[#123d22] text-base mb-5">
                            Forgot your password?{" "}
                            <Link href="/forgot-password" className=" font-semibold">
                                Reset here
                            </Link>
                        </Text>

                    </TouchableOpacity>


                    {/* Guest Button */}
                    <TouchableOpacity
                        onPress={handleGuest}
                        className="w-full bg-[#fff5b8] p-4 rounded-lg items-center"
                    >
                        <Text className="text-[#333] text-lg">Continue as Guest</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignIn;
