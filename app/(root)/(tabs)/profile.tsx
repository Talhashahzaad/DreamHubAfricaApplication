
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Link, Redirect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { clearToken, getToken } from "../../lib/auth";

const API_BASE_URL =
    Constants.expoConfig?.extra?.apiUrl ?? "https://api.dreamhubafrica.com";

// ✅ helper to clean token before sending in headers
async function getCleanToken(): Promise<string | null> {
    let token = await getToken();
    if (!token) return null;

    token = String(token)
        .replace(/^\s*"|"\s*$/g, "") // strip surrounding quotes if stored as JSON string
        .replace(/[\r\n\t]/g, "") // remove hidden newline/tab chars
        .trim();

    return token || null;
}

export default function ProfileScreen() {
    const [loading, setLoading] = useState(true);
    const [tokenChecked, setTokenChecked] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchProfile = React.useCallback(async () => {
        try {
            const token = await getCleanToken(); // ✅ use cleaned token
            console.log("ProfileScreen token:", JSON.stringify(token)); // debug log

            if (!token) {
                setUser(null);
                setTokenChecked(true);
                return;
            }

            const res = await fetch(`${API_BASE_URL}/user/profile`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401) {
                await clearToken();
                setUser(null);
                setTokenChecked(true);
                router.replace("/sign-in");
                return;
            }

            if (!res.ok) throw new Error("Failed to fetch profile");

            const data = await res.json();
            setUser(data);
            setTokenChecked(true);
        } catch (e) {
            console.error("Error fetching profile:", e);
            setUser(null);
            setTokenChecked(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [router]);

    useEffect(() => {
        fetchProfile();
    }, [router, fetchProfile]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchProfile();
    }, [fetchProfile]);

    if (loading && !tokenChecked) {
        return (
            <View className="flex-1 justify-center items-center bg-[#D7A73D]">
                <ActivityIndicator size="large" color="#184528" />
            </View>
        );
    }

    // Only redirect after token check finished
    if (tokenChecked && !user) {
        return <Redirect href="/sign-in" />;
    }

    return (
        <SafeAreaView className="flex-1 bg-[#E8B639] pt-[49px] px-4">
            {/* Header Section */}
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-[25px] font-bold text-[#205221]">Profile</Text>
                <View className="flex-row items-center">
                    <Link href="/setting" className="mr-5 text-[26px] text-[#205221]">
                        ⚙️
                    </Link>
                    <Link
                        href="#"
                        className="text-[16px] text-[#123d22]"
                    >
                        Edit
                    </Link>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#184528"
                        colors={["#184528"]}
                    />
                }
            >
                {/* Profile Card */}
                <View className="bg-[#FFEEAE] rounded-[20px] h-[134px] px-[20px] py-[32px] mb-4">
                    <View className="flex-row items-center">
                        <View className="w-[54px] h-[54px] rounded-full bg-[#123d22] items-center justify-center mr-4">
                            <Text className="text-white text-[26px] font-bold">
                                {user?.name ? user.name.charAt(0) : "U"}
                            </Text>
                        </View>

                        <View className="flex-1">
                            {/* Name row + verification */}
                            <View className="flex-row items-center justify-between">
                                <Text className="text-[22px] font-bold text-[#084325] mb-[2px]">
                                    {user?.name}
                                </Text>

                                {user?.isVerified ? (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={18}
                                        color="#22c55e"
                                    />
                                ) : (
                                    <Link
                                        href="/verified"
                                        className="text-[12px] text-[#184528] underline"
                                    >
                                        Verify now
                                    </Link>
                                )}
                            </View>

                            <Text className="text-[16px] text-[#084325] mb-1">
                                {user?.email}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Contact Info */}
                <View className="bg-[#fff5b8] rounded-[20px] h-[132px] p-[20px] mb-3 justify-center">
                    <View className="flex-row items-center mb-4">
                        <Ionicons
                            name="call-outline"
                            size={24}
                            color="#074224"
                            style={{ marginRight: 12 }}
                        />
                        <Text className="text-[15px] text-[#222] flex-1 flex-wrap">
                            {user?.phone}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons
                            name="location-outline"
                            size={24}
                            color="#074224"
                            style={{ marginRight: 12 }}
                        />
                        <Text className="text-[15px] text-[#222] flex-1 flex-wrap">
                            {user?.address}
                        </Text>
                    </View>
                </View>

                {/* Description */}
                <Text className="text-[#084325] text-[20px] font-semibold mb-4 mt-3">
                    Description
                </Text>
                <View className="bg-[#fff5b8] rounded-[20px] w-full h-[162px] px-[16px] py-[20px] mb-4">
                    <Text className="text-[#084325] text-[16px] leading-5">
                        {user?.about || "No description available"}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
