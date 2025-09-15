
import { Ionicons } from '@expo/vector-icons'
import Constants from "expo-constants"
import { Link, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? "https://api.dreamhubafrica.com";

const Marketplace = () => {
    const router = useRouter()
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/categories`)
                if (!response.ok) throw new Error(`Status ${response.status}`)
                const data = await response.json()
                const cats = Array.isArray(data)
                    ? data
                    : Array.isArray(data.categories)
                        ? data.categories
                        : []
                setCategories(cats)
            } catch (error) {
                console.error('Error fetching categories:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return (
        <View className="flex-1 bg-[#D7A73D]">
            <ScrollView>
                {/* SafeArea just for the header */}
                <SafeAreaView edges={['top']} className="bg-[#184528]">
                    <View className="w-full flex-row items-center px-4 py-4">
                        {/* Back button */}
                        <TouchableOpacity onPress={() => router.back()} className="mr-3">
                            <Ionicons name="chevron-back" size={26} color="#fff" />
                        </TouchableOpacity>

                        {/* Logo + Text */}
                        <View className="flex-row items-center">
                            <Image
                                source={require('../assets/images/logo4.png')}
                                className="w-12 h-12 mr-2"
                                resizeMode="contain"
                            />
                            <Text className="text-[20px] font-bold text-white tracking-wide">
                                DREAMHUB{'\n'}AFRICA
                            </Text>
                        </View>
                    </View>
                </SafeAreaView>

                {/* Page Content */}
                <View className="px-5">
                    {/* Title/Subtitle */}
                    <Text className="text-[32px] font-bold text-[#205221] mb-1 mt-4">Marketplace</Text>
                    <Text className="text-[15px] text-[#084325] mb-0">Buy and sell products</Text>
                    <Text className="text-[13px] text-[#084325] mb-5">Find items near you from real people</Text>

                    {/* Post an Item Button */}
                    <TouchableOpacity
                        className="bg-[#FF7E70] flex-row items-center justify-center rounded-2xl h-[54px] w-full mb-7"
                        activeOpacity={0.93}
                    >
                        <Link href="/create-listing">
                            <Text className="text-white text-[18px] font-semibold">＋ Post an Item</Text>
                        </Link>
                    </TouchableOpacity>

                    {/* Product Cards Grid */}
                    {loading ? (
                        <ActivityIndicator size="large" color="#205221" className="mt-10" />
                    ) : (
                        <View className="flex-row flex-wrap justify-between">
                            {categories.map((cat: any, index) => (
                                <View
                                    key={cat._id || index}
                                    className="bg-[#fff5b8] w-[47%] rounded-2xl px-5 pt-4 pb-4 mb-5"
                                    style={{ minHeight: 80 }}
                                >

                                    <Text className="text-[#205221] text-[15px] font-semibold">{cat.name}</Text>
                                    {/* <Text className="text-[#ba962a] text-xs font-medium">
                                        {cat.category || 'General'}
                                    </Text> */}
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

export default Marketplace
