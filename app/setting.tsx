import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";
import { useRouter } from 'expo-router'; // if using expo-router
import React, { useState } from 'react';
import { Alert, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? "https://api.dreamhubafrica.com";


const SettingsScreen = () => {
    const [notificationEnabled, setNotificationEnabled] = useState(true);
    const router = useRouter(); // for navigation

    const handleLogout = async () => {
        // Show confirmation alert
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("token");
                            // Call logout API
                            await fetch(`${API_BASE_URL}/logout`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                            });

                            // Remove token from AsyncStorage
                            await AsyncStorage.removeItem("token");

                            // Redirect to login page
                            router.replace("/sign-in");
                        } catch (error) {
                            console.error("Logout failed", error);
                            Alert.alert("Error", "Failed to logout. Please try again.");
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#D7A73D]">
            {/* Settings Header */}
            <View className="pt-8 pb-5 px-0">
                <Text className="text-[32px] font-bold text-[#205221] pl-5">Settings</Text>
            </View>

            {/* Panel Container */}
            <View className="bg-[#fff5b8] rounded-none px-0 py-0 pb-0">
                {/* Language Row */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="flex-row justify-between items-center px-5 pt-5 pb-2"
                >
                    <Text className="text-base text-[#205221]">Language</Text>
                    <View className="flex-row items-center">
                        <Text className="text-base text-[#205221] mr-2">English</Text>
                        {/* <Text className="text-[#205221] text-lg">&gt;</Text> */}
                    </View>
                </TouchableOpacity>

                {/* Notification Row */}
                <View className="flex-row justify-between items-center px-5 py-2">
                    <Text className="text-base text-[#205221]">Notification</Text>
                    <Switch
                        value={notificationEnabled}
                        onValueChange={setNotificationEnabled}
                        thumbColor={notificationEnabled ? "#205221" : "#cfcfcf"}
                        trackColor={{ false: "#d6d6d6", true: "#bfdfa7" }}
                        style={{ transform: [{ scaleX: 1.15 }, { scaleY: 1.15 }] }}
                    />
                </View>

                <TouchableOpacity activeOpacity={0.8} className="px-5 py-2">
                    <Text className="text-base text-[#205221]">Privacy</Text>
                </TouchableOpacity>

                {/* Help Row */}
                <TouchableOpacity activeOpacity={0.8} className="px-5 py-2">
                    <Text className="text-base text-[#205221]">Help</Text>
                </TouchableOpacity>

                {/* Logout Row */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="px-5 py-2"
                    onPress={handleLogout} // Add logout handler here
                >
                    <Text className="text-base text-[#205221]">Logout</Text>
                </TouchableOpacity>

                {/* Delete Account Row */}
                <TouchableOpacity activeOpacity={0.8} className="px-5 pt-2 pb-5">
                    <Text className="text-base text-[#205221]">Delete Account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default SettingsScreen;
