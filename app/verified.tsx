import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? "https://api.dreamhubafrica.com";

export default function VerifyAccountScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSendVerification = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Not logged in", "Please sign in.");
                return;
            }

            console.log("API_BASE_URL", `${API_BASE_URL}`);

            const profileRes = await fetch(`${API_BASE_URL}/user/profile`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const profileText = await profileRes.text();
            console.log("PROFILE status:", profileRes.status, "body:", profileText);
            if (!profileRes.ok) {
                throw new Error(`Profile failed (${profileRes.status})`);
            }
            const profile = profileText ? JSON.parse(profileText) : {};
            const id =
                profile?.id ??
                profile?._id ??
                profile?.userId ??
                profile?.user?.id ??
                profile?.user?._id ??
                null;
            const email = profile?.email ?? profile?.user?.email ?? null;
            console.log("Resolved from profile -> id:", id, "email:", email);


            // Attempt 1: token only
            let res = await fetch(`${API_BASE_URL}/auth/send-verification-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({}),
            });
            let text = await res.text();
            console.log("Verify token-only:", res.status, text);
            if (res.ok) {
                Alert.alert(
                    "Verification email sent",
                    "Check your email.",
                    [{ text: "OK", onPress: () => router.replace("/(root)/(tabs)/profile?refresh=1") }],
                    { cancelable: false }
                );
                return;
            }

            // Attempt 2: { userId }
            if (id) {
                res = await fetch(`${API_BASE_URL}/auth/send-verification-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ userId: String(id) }),
                });
                text = await res.text();
                console.log("Verify with {userId}:", res.status, text);
                if (res.ok) {
                    Alert.alert(
                        "Verification email sent",
                        "Check your email.",
                        [{ text: "OK", onPress: () => router.replace("/(root)/(tabs)/profile?refresh=1") }],
                        { cancelable: false }
                    );
                    return;
                }

                // Attempt 3: { id }
                res = await fetch(`${API_BASE_URL}/auth/send-verification-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ id: String(id) }),
                });
                text = await res.text();
                console.log("Verify with {id}:", res.status, text);
                if (res.ok) {
                    Alert.alert(
                        "Verification email sent",
                        "Check your email.",
                        [{ text: "OK", onPress: () => router.replace("/(root)/(tabs)/profile?refresh=1") }],
                        { cancelable: false }
                    );
                    return;
                }

                // Attempt 4: { user_id }
                res = await fetch(`${API_BASE_URL}/auth/send-verification-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ user_id: String(id) }),
                });
                text = await res.text();
                console.log("Verify with {user_id}:", res.status, text);
                if (res.ok) {
                    Alert.alert(
                        "Verification email sent",
                        "Check your email.",
                        [{ text: "OK", onPress: () => router.replace("/(root)/(tabs)/profile?refresh=1") }],
                        { cancelable: false }
                    );
                    return;
                }
            }

            // Attempt 5: { email }
            if (email) {
                res = await fetch(`${API_BASE_URL}/auth/send-verification-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ email }),
                });
                text = await res.text();
                console.log("Verify with {email}:", res.status, text);
                if (res.ok) {
                    Alert.alert(
                        "Verification email sent",
                        "Check your email.",
                        [{ text: "OK", onPress: () => router.replace("/(root)/(tabs)/profile?refresh=1") }],
                        { cancelable: false }
                    );
                    return;
                }
            }


            Alert.alert("Error", "User not found by verification service. Check environment/DB or payload contract.");
        } catch (e: any) {
            console.error("Verification error:", e);
            Alert.alert("Error", e?.message || "Verification failed.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView className="flex-1 bg-[#E8B639] justify-between items-center px-6 pt-10 pb-8">
            <View className="items-center">
                <View className="flex-row items-center mb-14">
                    <Image
                        source={require("../assets/images/logo.png")}
                        className="w-[250px] h-[250px]"
                        resizeMode="contain"
                    />
                </View>

                <Text className="text-[#0A4522] text-[28px] font-bold mb-8">
                    Verify Your Account
                </Text>

                <Image
                    source={require("../assets/images/shield-check.png")}
                    className="w-40 h-40 mb-8"
                    resizeMode="contain"
                />

                <Text className="text-[#0A4522] text-[18px] text-center leading-6 px-4">
                    Verify your identity to{"\n"}access the marketplace
                </Text>
            </View>


            <TouchableOpacity
                className="w-[353px] h-[57px] bg-[#074224] rounded-[15px] justify-center items-center mx-5 mb-6"
                activeOpacity={0.8}
                onPress={handleSendVerification}
                disabled={loading}
            >
                <Text className="text-white text-[16px] font-bold">
                    {loading ? "Sending..." : "Verify"}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
