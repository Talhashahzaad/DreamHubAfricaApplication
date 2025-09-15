
import { Link } from 'expo-router';
import React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#E8B639] items-center px-4 pt-12">
      {/* Logo */}
      <Image
        source={require('../../../assets/images/logo2.png')}
        className="w-4/5 max-w-xs aspect-[2.6] mb-14"
        resizeMode="contain"
      />
      {/* Spacer - optional */}
      <View className={Platform.OS === 'android' ? "mb-20" : "mb-20"} />

      {/* Welcome Text */}
      <Text className="text-[22px] font-semibold text-[#084325] text-center">Welcome to</Text>
      <Text className="text-[22px] font-bold text-[#084325] text-center mb-2">
        DreamHub Africa
      </Text>

      {/* Subtitle */}
      <Text className="text-center text-base text-[#084325] leading-tight mb-8">
        A platform built for Africa - starting{'\n'}
        with a simple way to buy and sell
      </Text>

      {/* Card */}
      <View className="w-11/12 max-w-xl bg-[#FFEEAE] rounded-2xl p-6 mb-8">
        <View className="flex-row items-center mb-5">
          <View className="bg-[#FBE48F] w-14 h-14 items-center justify-center rounded-lg mr-3">
            <Image
              source={require('../../../assets/images/tag.png')}
              className="w-8 h-8"
              resizeMode="contain"
            />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-[#074224] mb-1">Marketplace</Text>
            <Text className="text-base text-[#074224] leading-snug">
              Buy and sell products with real people near you.
            </Text>
          </View>
        </View>
        <View className="mb-4">
          <Text className="text-base text-[#074224] leading-tight mb-1">✓ Safe & local</Text>
          <Text className="text-base text-[#074224] leading-tight mb-1">✓ Easy to post your items</Text>
          <Text className="text-base text-[#074224] leading-tight">✓ Verified users only</Text>
        </View>
        <TouchableOpacity className="bg-[#074224] py-4 rounded-xl w-full items-center justify-center">
          <Link href="/market-place" className="text-white text-base font-bold">
            Continue to Marketplace
          </Link>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
