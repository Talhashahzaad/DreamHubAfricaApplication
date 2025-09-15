// import { useLocalSearchParams } from 'expo-router';
// import React from 'react';
// import { Text, View } from 'react-native';

// const Listing = () => {
//     const { id } = useLocalSearchParams();

//     return (
//         <View>
//             <Text>Listing {id}</Text>
//         </View>
//     )
// }

// export default Listing

import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const phonesvg = require('../../../assets/images/phone.png'); // Replace with your phone vector asset

const ListingCard = () => {
    return (
        <SafeAreaView className="flex-1 bg-[#D7A73D] px-0">
            <View className="items-center pt-14">
                {/* Phone Icon in pale-yellow squared card */}
                <View className="w-[280px] h-[250px] rounded-2xl bg-[#f6e39e] items-center justify-center mb-6">
                    <Image source={phonesvg} className="w-[120px] h-[170px]" resizeMode="contain" />
                </View>
                {/* Product Title, Price & Location */}
                <Text className="text-[#113d20] text-[32px] font-bold text-center">Smartphones</Text>
                <Text className="text-[#113d20] text-[32px] font-bold mb-1 text-center">D12,000</Text>
                <Text className="text-[#113d20] text-[20px] mb-7 text-center">Serrekunda</Text>
                {/* Seller Card */}
                <View className="w-[92%] bg-[#fff5b8] rounded-2xl px-5 pt-5 pb-3 mb-5 shadow-sm">
                    <View className="flex-row items-center mb-1">
                        {/* Seller Avatar */}
                        <View className="w-10 h-10 bg-[#eeba32] rounded-full items-center justify-center mr-2.5 border border-[#e1c56d]">
                            <Text className="font-bold text-[#113d20] text-xl">M</Text>
                        </View>

                        {/* Seller Name and Verified Badge */}
                        <View className="flex-row items-center flex-1">
                            <Text className="font-semibold text-[#113d20] text-[18px]">
                                Musa Jallow
                            </Text>
                            <View className="bg-[#16643d] px-3 py-0.5 rounded-full ml-3">
                                <Text className="text-white text-xs font-semibold">Verified</Text>
                            </View>
                        </View>
                    </View>

                    {/* Description Section starts BELOW the avatar + name row */}
                    <View className="mt-6">
                        <Text className="text-[#113d20] text-base font-bold mb-1 mt-4 tracking-[.02em]">
                            Description
                        </Text>
                        <Text className="text-[#113d20] text-[15.5px] leading-tight mb-2 opacity-95">
                            Brand new smartphone with latest features.
                        </Text>
                    </View>
                </View>



                {/* Contact Seller Button */}
                <TouchableOpacity className="w-[92%] bg-[#113d20] py-4 rounded-xl items-center mt-2 shadow">
                    <Text className="text-white text-lg font-semibold">Contact Seller</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ListingCard;
