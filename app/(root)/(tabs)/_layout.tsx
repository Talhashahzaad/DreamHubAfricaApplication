import { Inter_600SemiBold, useFonts } from '@expo-google-fonts/inter';
import { Ionicons } from '@expo/vector-icons';
import { SplashScreen, Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';


SplashScreen.preventAutoHideAsync();

// Custom tab icon component
const TabIcon = ({
    focused,
    icon,
    title,
}: {
    focused: boolean;
    icon: any;
    title: string;
}) => (
    <View className="items-center mt-4 flex flex-col pb-1">
        <Ionicons
            name={icon}
            size={24}
            color={focused ? '#074224' : '#666876'}
        />
        <Text
            style={{ fontFamily: 'Inter_600SemiBold' }}
            className={`${focused ? 'text-primary-300' : 'text-black-200'
                } text-xs w-full text-center mt-1`}
        >
            {title}
        </Text>
    </View>
);

const TabsLayout = () => {
    const [fontsLoaded] = useFonts({
        Inter_600SemiBold,
    });

    if (!fontsLoaded) return null;

    SplashScreen.hideAsync();

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: '#eeba32',
                    position: 'absolute',
                    borderTopColor: 'transparent',
                    borderTopWidth: 1,
                    minHeight: 70,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="home-outline" focused={focused} title="Home" />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="search-outline" focused={focused} title="Explore" />
                    ),
                }}
            />
            {/* Profile with filled user icon */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="person" focused={focused} title="Profile" />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
