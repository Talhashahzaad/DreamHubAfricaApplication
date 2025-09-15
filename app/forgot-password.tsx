import { useRouter } from "expo-router";
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

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleReset = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("https://api.dreamhubafrica.com/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "A password reset link has been sent on your email.");
                router.push("/sign-in"); // back to login
            } else {
                Alert.alert("Error", data.error || "Something went wrong.");
            }
        } catch (err) {
            Alert.alert("Error", "Network error, please try again.");
        } finally {
            setLoading(false);
        }
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
                        className="w-[200px] h-[200px] mb-5"
                        resizeMode="contain"
                    />

                    {/* Title */}
                    <Text className="text-[32px] font-bold text-[#333] mb-8">
                        Reset Password
                    </Text>

                    {/* Email Input */}
                    <TextInput
                        placeholder="Enter your email"
                        placeholderTextColor="#333"
                        value={email}
                        onChangeText={setEmail}
                        className="w-full h-[50px] border border-[#ddd] rounded-lg px-4 mb-6 text-base bg-[#fff5b8]"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    {/* Reset Button */}
                    <TouchableOpacity
                        onPress={handleReset}
                        disabled={loading}
                        className="w-full bg-[#123d22] p-4 rounded-lg items-center mb-6"
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white text-lg font-semibold">
                                Send Reset Link
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Back to Login */}
                    <TouchableOpacity onPress={() => router.push("/sign-in")}>
                        <Text className="text-[#739881] text-base">
                            Remembered your password?{" "}
                            <Text className="font-semibold">Login here</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
