// import React from 'react';
// import { Image, Text, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const phonesvg = require('../assets/images/phone.png'); // Replace with your phone vector asset

// const ListingCard = () => {
//     return (
//         <SafeAreaView className="flex-1 bg-[#D7A73D] px-0">
//             <View className="items-center pt-14">
//                 {/* Phone Icon in pale-yellow squared card */}
//                 <View className="w-[280px] h-[250px] rounded-2xl bg-[#f6e39e] items-center justify-center mb-6">
//                     <Image source={phonesvg} className="w-[120px] h-[170px]" resizeMode="contain" />
//                 </View>
//                 {/* Product Title, Price & Location */}
//                 <Text className="text-[#113d20] text-[32px] font-bold text-center">Smartphones</Text>
//                 <Text className="text-[#113d20] text-[32px] font-bold mb-1 text-center">D12,000</Text>
//                 <Text className="text-[#113d20] text-[20px] mb-7 text-center">Serrekunda</Text>
//                 {/* Seller Card */}
//                 <View className="w-[92%] bg-[#fff5b8] rounded-2xl px-5 pt-5 pb-3 mb-5 shadow-sm">
//                     <View className="flex-row items-center mb-1">
//                         {/* Seller Avatar */}
//                         <View className="w-10 h-10 bg-[#eeba32] rounded-full items-center justify-center mr-2.5 border border-[#e1c56d]">
//                             <Text className="font-bold text-[#113d20] text-xl">M</Text>
//                         </View>

//                         {/* Seller Name and Verified Badge */}
//                         <View className="flex-row items-center flex-1">
//                             <Text className="font-semibold text-[#113d20] text-[18px]">
//                                 Musa Jallow
//                             </Text>
//                             <View className="bg-[#16643d] px-3 py-0.5 rounded-full ml-3">
//                                 <Text className="text-white text-xs font-semibold">Verified</Text>
//                             </View>
//                         </View>
//                     </View>

//                     {/* Description Section starts BELOW the avatar + name row */}
//                     <View className="mt-6">
//                         <Text className="text-[#113d20] text-base font-bold mb-1 mt-4 tracking-[.02em]">
//                             Description
//                         </Text>
//                         <Text className="text-[#113d20] text-[15.5px] leading-tight mb-2 opacity-95">
//                             Brand new smartphone with latest features.
//                         </Text>
//                     </View>
//                 </View>



//                 {/* Contact Seller Button */}
//                 <TouchableOpacity className="w-[92%] bg-[#113d20] py-4 rounded-xl items-center mt-2 shadow">
//                     <Text className="text-white text-lg font-semibold">Contact Seller</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     )
// }

// export default ListingCard;

// import Constants from 'expo-constants';
// import { useLocalSearchParams } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, Alert, Image, Linking, Text, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const phonesvg = require('../../assets/images/phone.png'); // Fallback image
// const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? "https://api.dreamhubafrica.com";

// const ListingCard = () => {
//     const { slug } = useLocalSearchParams();
//     const [listing, setListing] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchSingleListing = async () => {
//             try {
//                 setLoading(true);
//                 console.log("Fetching listing with slug:", slug);
//                 console.log("API URL:", `${API_BASE_URL}/listings/${slug}`);

//                 const response = await fetch(`${API_BASE_URL}/listings/${slug}`);
//                 console.log("Response status:", response.status);

//                 if (!response.ok) {
//                     throw new Error(`Failed to fetch listing: ${response.status}`);
//                 }

//                 const data = await response.json();
//                 console.log("API Response:", data);

//                 const listingData = data.listing || data;
//                 console.log("Extracted listing data:", listingData);

//                 setListing(listingData);
//                 setError(null);
//             } catch (error) {
//                 console.error("Error fetching single listing:", error);
//                 setError(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (slug) {
//             console.log("Slug received:", slug);
//             fetchSingleListing();
//         } else {
//             console.log("No slug provided");
//             setError("No listing ID provided");
//             setLoading(false);
//         }
//     }, [slug]);

//     // Helper functions to safely get data
//     const getImageUrl = () => {
//         if (listing?.images && Array.isArray(listing.images) && listing.images.length > 0) {
//             const firstImage = listing.images[0]?.imageUrl;
//             if (firstImage) {
//                 return `${API_BASE_URL}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`;
//             }
//         }
//         return null;
//     };

//     const getLocationName = () => {
//         if (listing?.location) {
//             return typeof listing.location === 'object'
//                 ? listing.location.name || 'Location not available'
//                 : String(listing.location);
//         }
//         return 'Location not available';
//     };

//     const getPriceDisplay = () => {
//         if (listing?.price) {
//             return typeof listing.price === 'number'
//                 ? `GMD ${listing.price.toLocaleString()}`
//                 : String(listing.price);
//         }
//         return 'Price not available';
//     };


//     const getSellerName = () => {
//         if (listing?.seller) {
//             return typeof listing.seller === 'object'
//                 ? listing.seller.name || listing.seller.email || 'Unknown Seller'
//                 : String(listing.seller);
//         }
//         return 'Unknown Seller';
//     };

//     const getSellerInitial = () => {
//         const sellerName = getSellerName();
//         return sellerName.charAt(0).toUpperCase();
//     };

//     // ✅ NEW: Get seller contact details
//     const getSellerPhone = () => {
//         if (listing?.seller?.phone) {
//             return String(listing.seller.phone);
//         }
//         return null;
//     };

//     const getSellerEmail = () => {
//         if (listing?.seller?.email) {
//             return listing.seller.email;
//         }
//         return null;
//     };

//     // ✅ NEW: Handle phone call
//     const handleContactSeller = async () => {
//         const phoneNumber = getSellerPhone();

//         if (!phoneNumber) {
//             Alert.alert("No Phone Number", "Seller's phone number is not available.");
//             return;
//         }

//         const phoneUrl = `tel:${phoneNumber}`;

//         try {
//             const canOpen = await Linking.canOpenURL(phoneUrl);
//             if (canOpen) {
//                 await Linking.openURL(phoneUrl);
//             } else {
//                 Alert.alert("Unable to Call", "Your device doesn't support phone calls.");
//             }
//         } catch (error) {
//             console.error("Error making phone call:", error);
//             Alert.alert("Error", "Unable to make phone call. Please try again.");
//         }
//     };

//     if (loading) {
//         return (
//             <SafeAreaView className="flex-1 bg-[#D7A73D] px-0">
//                 <View className="flex-1 items-center justify-center">
//                     <ActivityIndicator size="large" color="#113d20" />
//                     <Text className="text-[#113d20] text-lg mt-4">Loading listing...</Text>
//                     <Text className="text-[#113d20] text-sm mt-2">Slug: {slug}</Text>
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     if (error || !listing) {
//         return (
//             <SafeAreaView className="flex-1 bg-[#D7A73D] px-0">
//                 <View className="flex-1 items-center justify-center px-4">
//                     <Text className="text-[#113d20] text-lg text-center mb-2">
//                         {error || 'Listing not found'}
//                     </Text>
//                     <Text className="text-[#113d20] text-sm text-center">
//                         Slug: {slug}
//                     </Text>
//                     <Text className="text-[#113d20] text-sm text-center mt-2">
//                         API: {`${API_BASE_URL}/listings/${slug}`}
//                     </Text>
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     return (
//         <SafeAreaView className="flex-1 bg-[#D7A73D] px-0">
//             <View className="items-center pt-14">
//                 {/* Product Image in pale-yellow squared card */}
//                 <View className="w-[280px] h-[250px] rounded-2xl bg-[#f6e39e] items-center justify-center mb-4">
//                     <Image
//                         source={getImageUrl() ? { uri: getImageUrl() } : phonesvg}
//                         className="w-[120px] h-[170px]"
//                         resizeMode="contain"
//                     />
//                 </View>
//                 {/* Product Title, Price & Location */}
//                 <Text className="text-[#113d20] text-[32px] font-bold text-center">
//                     {listing.title || 'Untitled'}
//                 </Text>
//                 <Text className="text-[#113d20] text-[20px] font-bold mb-2 text-center">
//                     {getPriceDisplay()}
//                 </Text>
//                 {/* <Text className="text-[#113d20] text-[20px] mb-7 text-center">
//                     {getLocationName()}
//                 </Text> */}
//                 {/* Seller Card */}
//                 <View className="w-[92%] bg-[#fff5b8] rounded-2xl px-5 pt-5 pb-3 mb-5 shadow-sm">
//                     <View className="flex-row items-center mb-1">
//                         {/* Seller Avatar */}
//                         <View className="w-10 h-10 bg-[#eeba32] rounded-full items-center justify-center mr-2.5 border border-[#e1c56d]">
//                             <Text className="font-bold text-[#113d20] text-xl">
//                                 {getSellerInitial()}
//                             </Text>
//                         </View>

//                         {/* Seller Name and Verified Badge */}
//                         <View className="flex-row items-center flex-1">
//                             <Text className="font-semibold text-[#113d20] text-[18px]">
//                                 {getSellerName()}
//                             </Text>
//                             <View className="bg-[#16643d] px-3 py-0.5 rounded-full ml-3">
//                                 <Text className="text-white text-xs font-semibold">Verified</Text>
//                             </View>
//                         </View>
//                     </View>

//                     {/* ✅ NEW: Seller Contact Details */}
//                     <View className="mt-4 border-t border-[#e1c56d] pt-4">
//                         <Text className="text-[#113d20] text-base font-bold mb-2 tracking-[.02em]">
//                             Contact Information
//                         </Text>

//                         {/* Phone Number */}
//                         {getSellerPhone() && (
//                             <View className="flex-row items-center mb-2">
//                                 <Text className="text-[#113d20] text-[15px] font-semibold w-16">Phone:</Text>
//                                 <Text className="text-[#113d20] text-[15px] flex-1">
//                                     {getSellerPhone()}
//                                 </Text>
//                             </View>
//                         )}

//                         {/* Email */}
//                         {getSellerEmail() && (
//                             <View className="flex-row items-center mb-2">
//                                 <Text className="text-[#113d20] text-[15px] font-semibold w-16">Email:</Text>
//                                 <Text className="text-[#113d20] text-[15px] flex-1">
//                                     {getSellerEmail()}
//                                 </Text>
//                             </View>
//                         )}

//                         {/* City/Location */}
//                         <View className="flex-row items-center mb-2">
//                             <Text className="text-[#113d20] text-[15px] font-semibold w-16">City:</Text>
//                             <Text className="text-[#113d20] text-[15px] flex-1">
//                                 {getLocationName()}
//                             </Text>
//                         </View>
//                     </View>

//                     {/* Description Section */}
//                     <View className="mt-4 border-t border-[#e1c56d] pt-4">
//                         <Text className="text-[#113d20] text-base font-bold mb-2 tracking-[.02em]">
//                             Description
//                         </Text>
//                         <Text className="text-[#113d20] text-[15.5px] leading-tight mb-2 opacity-95">
//                             {listing.description || 'No description available.'}
//                         </Text>
//                     </View>
//                 </View>

//                 {/* ✅ UPDATED: Contact Seller Button with Call Functionality */}
//                 <TouchableOpacity
//                     className="w-[92%] bg-[#113d20] py-4 rounded-xl items-center mb-5 shadow"
//                     onPress={handleContactSeller}
//                 >
//                     <Text className="text-white text-lg font-semibold">
//                         Contact Seller
//                     </Text>
//                 </TouchableOpacity>


//             </View>
//         </SafeAreaView>
//     );
// };

// export default ListingCard; 


// import Constants from 'expo-constants';
// import { useLocalSearchParams } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, Alert, Image, Linking, Text, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const phonesvg = require('../../assets/images/phone.png'); // Fallback image
// const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? "https://api.dreamhubafrica.com";

// const ListingCard = () => {
//     const { slug } = useLocalSearchParams();
//     const [listing, setListing] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchSingleListing = async () => {
//             try {
//                 setLoading(true);
//                 console.log("Fetching listing with slug:", slug);
//                 console.log("API URL:", `${API_BASE_URL}/listings/${slug}`);

//                 const response = await fetch(`${API_BASE_URL}/listings/${slug}`);
//                 console.log("Response status:", response.status);

//                 if (!response.ok) {
//                     throw new Error(`Failed to fetch listing: ${response.status}`);
//                 }

//                 const data = await response.json();
//                 console.log("API Response:", data);

//                 const listingData = data.listing || data;
//                 console.log("Extracted listing data:", listingData);

//                 setListing(listingData);
//                 setError(null);
//             } catch (error) {
//                 console.error("Error fetching single listing:", error);
//                 setError(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (slug) {
//             console.log("Slug received:", slug);
//             fetchSingleListing();
//         } else {
//             console.log("No slug provided");
//             setError("No listing ID provided");
//             setLoading(false);
//         }
//     }, [slug]);

//     // Helper functions to safely get data
//     const getImageUrl = () => {
//         if (listing?.images && Array.isArray(listing.images) && listing.images.length > 0) {
//             const firstImage = listing.images[0]?.imageUrl;
//             if (firstImage) {
//                 return `${API_BASE_URL}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`;
//             }
//         }
//         return null;
//     };

//     const getLocationName = () => {
//         if (listing?.location) {
//             return typeof listing.location === 'object'
//                 ? listing.location.name || 'Location not available'
//                 : String(listing.location);
//         }
//         return 'Location not available';
//     };

//     // ✅ Format Gambian Dalasi prices: D58, D1,000 etc.
//     const getPriceDisplay = () => {
//         if (listing?.price) {
//             const priceNum = Number(listing.price);
//             if (!isNaN(priceNum)) {
//                 return `D${priceNum.toLocaleString("en-US")}`;
//             }
//             return String(listing.price);
//         }
//         return 'Price not available';
//     };

//     const getSellerName = () => {
//         if (listing?.seller) {
//             return typeof listing.seller === 'object'
//                 ? listing.seller.name || listing.seller.email || 'Unknown Seller'
//                 : String(listing.seller);
//         }
//         return 'Unknown Seller';
//     };

//     const getSellerInitial = () => {
//         const sellerName = getSellerName();
//         return sellerName.charAt(0).toUpperCase();
//     };

//     // ✅ Only Phone Number shown
//     // const getSellerPhone = () => {
//     //     if (listing?.seller?.phone) {
//     //         return String(listing.seller.phone);
//     //     }
//     //     return null;
//     // };

//     const getSellerPhone = () => {
//         if (listing?.seller?.phone) {
//             const rawPhone = String(listing.seller.phone);

//             // ✅ Prepend +220 if not already included
//             if (rawPhone.startsWith('+220')) {
//                 return rawPhone;
//             }
//             return `+220${rawPhone}`;
//         }
//         return null;
//     };


//     // ✅ Call seller
//     const handleContactSeller = async () => {
//         const phoneNumber = getSellerPhone();

//         if (!phoneNumber) {
//             Alert.alert("No Phone Number", "Seller's phone number is not available.");
//             return;
//         }

//         const phoneUrl = `tel:${phoneNumber}`;

//         try {
//             const canOpen = await Linking.canOpenURL(phoneUrl);
//             if (canOpen) {
//                 await Linking.openURL(phoneUrl);
//             } else {
//                 Alert.alert("Unable to Call", "Your device doesn't support phone calls.");
//             }
//         } catch (error) {
//             console.error("Error making phone call:", error);
//             Alert.alert("Error", "Unable to make phone call. Please try again.");
//         }
//     };

//     if (loading) {
//         return (
//             <SafeAreaView className="flex-1 bg-[#D7A73D] px-0">
//                 <View className="flex-1 items-center justify-center">
//                     <ActivityIndicator size="large" color="#113d20" />
//                     <Text className="text-[#113d20] text-lg mt-4">Loading listing...</Text>
//                     <Text className="text-[#113d20] text-sm mt-2">Slug: {slug}</Text>
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     if (error || !listing) {
//         return (
//             <SafeAreaView className="flex-1 bg-[#D7A73D] px-0">
//                 <View className="flex-1 items-center justify-center px-4">
//                     <Text className="text-[#113d20] text-lg text-center mb-2">
//                         {error || 'Listing not found'}
//                     </Text>
//                     <Text className="text-[#113d20] text-sm text-center">
//                         Slug: {slug}
//                     </Text>
//                     <Text className="text-[#113d20] text-sm text-center mt-2">
//                         API: {`${API_BASE_URL}/listings/${slug}`}
//                     </Text>
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     return (
//         <SafeAreaView className="flex-1 bg-[#D7A73D] px-0">
//             <View className="items-center pt-14">
//                 {/* Product Image in pale-yellow squared card */}
//                 <View className="w-[280px] h-[250px] rounded-2xl bg-[#f6e39e] items-center justify-center mb-4">
//                     <Image
//                         source={getImageUrl() ? { uri: getImageUrl() } : phonesvg}
//                         className="w-[120px] h-[170px]"
//                         resizeMode="contain"
//                     />
//                 </View>
//                 {/* Product Title, Price & Location */}
//                 <Text className="text-[#113d20] text-[32px] font-bold text-center">
//                     {listing.title || 'Untitled'}
//                 </Text>
//                 <Text className="text-[#113d20] text-[20px] font-bold mb-2 text-center">
//                     {getPriceDisplay()}
//                 </Text>

//                 {/* Seller Card */}
//                 <View className="w-[92%] bg-[#fff5b8] rounded-2xl px-5 pt-5 pb-3 mb-5 shadow-sm">
//                     <View className="flex-row items-center mb-1">
//                         {/* Seller Avatar */}
//                         <View className="w-10 h-10 bg-[#eeba32] rounded-full items-center justify-center mr-2.5 border border-[#e1c56d]">
//                             <Text className="font-bold text-[#113d20] text-xl">
//                                 {getSellerInitial()}
//                             </Text>
//                         </View>

//                         {/* Seller Name and Verified Badge */}
//                         <View className="flex-row items-center flex-1">
//                             <Text className="font-semibold text-[#113d20] text-[18px]">
//                                 {getSellerName()}
//                             </Text>
//                             <View className="bg-[#16643d] px-3 py-0.5 rounded-full ml-3">
//                                 <Text className="text-white text-xs font-semibold">Verified</Text>
//                             </View>
//                         </View>
//                     </View>

//                     {/* ✅ Contact Info (Phone + Location only) */}
//                     <View className="mt-4 border-t border-[#e1c56d] pt-4">
//                         <Text className="text-[#113d20] text-base font-bold mb-2 tracking-[.02em]">
//                             Contact Information
//                         </Text>

//                         {/* Phone Number */}
//                         {getSellerPhone() && (
//                             <View className="flex-row items-center mb-2">
//                                 <Text className="text-[#113d20] text-[15px] font-semibold w-20">Phone:</Text>
//                                 <Text className="text-[#113d20] text-[15px] flex-1">
//                                     {getSellerPhone()}
//                                 </Text>
//                             </View>
//                         )}

//                         {/* ✅ Location instead of City */}
//                         <View className="flex-row items-center mb-2">
//                             <Text className="text-[#113d20] text-[15px] font-semibold w-20">Location:</Text>
//                             <Text className="text-[#113d20] text-[15px] flex-1">
//                                 {getLocationName()}
//                             </Text>
//                         </View>
//                     </View>

//                     {/* Description Section */}
//                     <View className="mt-4 border-t border-[#e1c56d] pt-4">
//                         <Text className="text-[#113d20] text-base font-bold mb-2 tracking-[.02em]">
//                             Description
//                         </Text>
//                         <Text className="text-[#113d20] text-[15.5px] leading-tight mb-2 opacity-95">
//                             {listing.description || 'No description available.'}
//                         </Text>
//                     </View>
//                 </View>

//                 {/* Contact Seller Button */}
//                 <TouchableOpacity
//                     className="w-[92%] bg-[#113d20] py-4 rounded-xl items-center mb-5 shadow"
//                     onPress={handleContactSeller}
//                 >
//                     <Text className="text-white text-lg font-semibold">
//                         Contact Seller
//                     </Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// };

// export default ListingCard;
import Constants from 'expo-constants';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Linking,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const phonesvg = require('../../assets/images/phone.png'); // Fallback image
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? "https://api.dreamhubafrica.com";

const ListingCard = () => {
    const { slug } = useLocalSearchParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ New state for fullscreen preview
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchSingleListing = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/listings/${slug}`);
                if (!response.ok) throw new Error(`Failed to fetch listing: ${response.status}`);
                const data = await response.json();
                setListing(data.listing || data);
                setError(null);
            } catch (error) {
                console.error("Error fetching single listing:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchSingleListing();
        } else {
            setError("No listing ID provided");
            setLoading(false);
        }
    }, [slug]);

    // ✅ Helpers
    const getImageUrl = (imgPath) =>
        `${API_BASE_URL}${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;

    const getLocationName = () => {
        if (listing?.location) {
            return typeof listing.location === 'object'
                ? listing.location.name || 'Location not available'
                : String(listing.location);
        }
        return 'Location not available';
    };

    const getPriceDisplay = () => {
        if (listing?.price) {
            const priceNum = Number(listing.price);
            if (!isNaN(priceNum)) {
                return `D${priceNum.toLocaleString("en-US")}`;
            }
            return String(listing.price);
        }
        return 'Price not available';
    };

    const getSellerName = () => {
        if (listing?.seller) {
            return typeof listing.seller === 'object'
                ? listing.seller.name || listing.seller.email || 'Unknown Seller'
                : String(listing.seller);
        }
        return 'Unknown Seller';
    };

    const getSellerInitial = () => getSellerName().charAt(0).toUpperCase();

    const getSellerPhone = () => {
        if (listing?.seller?.phone) {
            const rawPhone = String(listing.seller.phone);
            return rawPhone.startsWith('+220') ? rawPhone : `+220${rawPhone}`;
        }
        return null;
    };

    const handleContactSeller = async () => {
        const phoneNumber = getSellerPhone();
        if (!phoneNumber) {
            Alert.alert("No Phone Number", "Seller's phone number is not available.");
            return;
        }
        const phoneUrl = `tel:${phoneNumber}`;
        try {
            const canOpen = await Linking.canOpenURL(phoneUrl);
            if (canOpen) await Linking.openURL(phoneUrl);
            else Alert.alert("Unable to Call", "Your device doesn't support phone calls.");
        } catch (error) {
            console.error("Error making phone call:", error);
            Alert.alert("Error", "Unable to make phone call. Please try again.");
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#D7A73D] px-0">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#113d20" />
                    <Text className="text-[#113d20] text-lg mt-4">Loading listing...</Text>
                    <Text className="text-[#113d20] text-sm mt-2">Slug: {slug}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !listing) {
        return (
            <SafeAreaView className="flex-1 bg-[#D7A73D] px-0">
                <View className="flex-1 items-center justify-center px-4">
                    <Text className="text-[#113d20] text-lg text-center mb-2">
                        {error || 'Listing not found'}
                    </Text>
                    <Text className="text-[#113d20] text-sm text-center">Slug: {slug}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#D7A73D] px-0">
            <View className="items-center pt-14">
                {/* ✅ Image Carousel */}
                <View className="w-[280px] h-[250px] rounded-2xl bg-[#f6e39e] items-center justify-center mb-4">
                    {listing?.images && listing.images.length > 0 ? (
                        <FlatList
                            data={listing.images}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => `${item._id || index}`}
                            renderItem={({ item }) => {
                                const imageUrl = getImageUrl(item.imageUrl);
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => {
                                            setPreviewImage(imageUrl);
                                            setPreviewVisible(true);
                                        }}
                                    >
                                        <Image
                                            source={{ uri: imageUrl }}
                                            className="w-[280px] h-[250px] rounded-2xl"
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    ) : (
                        <Image
                            source={phonesvg}
                            className="w-[120px] h-[170px]"
                            resizeMode="contain"
                        />
                    )}
                </View>

                {/* ✅ Fullscreen Preview Modal */}
                <Modal visible={previewVisible} transparent animationType="fade">
                    <View className="flex-1 bg-black items-center justify-center">
                        <TouchableOpacity
                            className="absolute top-10 right-5 z-10"
                            onPress={() => setPreviewVisible(false)}
                        >
                            <Text className="text-white text-lg font-bold">✕</Text>
                        </TouchableOpacity>
                        <Image
                            source={{ uri: previewImage }}
                            className="w-full h-full"
                            resizeMode="contain"
                        />
                    </View>
                </Modal>

                {/* Title + Price */}
                <Text className="text-[#113d20] text-[32px] font-bold text-center">
                    {listing.title || 'Untitled'}
                </Text>
                <Text className="text-[#113d20] text-[20px] font-bold mb-2 text-center">
                    {getPriceDisplay()}
                </Text>

                {/* Seller Card */}
                <View className="w-[92%] bg-[#fff5b8] rounded-2xl px-5 pt-5 pb-3 mb-5 shadow-sm">
                    <View className="flex-row items-center mb-1">
                        <View className="w-10 h-10 bg-[#eeba32] rounded-full items-center justify-center mr-2.5 border border-[#e1c56d]">
                            <Text className="font-bold text-[#113d20] text-xl">
                                {getSellerInitial()}
                            </Text>
                        </View>
                        <View className="flex-row items-center flex-1">
                            <Text className="font-semibold text-[#113d20] text-[18px]">
                                {getSellerName()}
                            </Text>
                            <View className="bg-[#16643d] px-3 py-0.5 rounded-full ml-3">
                                <Text className="text-white text-xs font-semibold">Verified</Text>
                            </View>
                        </View>
                    </View>

                    {/* Contact Info */}
                    <View className="mt-4 border-t border-[#e1c56d] pt-4">
                        <Text className="text-[#113d20] text-base font-bold mb-2">
                            Contact Information
                        </Text>
                        {getSellerPhone() && (
                            <View className="flex-row items-center mb-2">
                                <Text className="text-[#113d20] text-[15px] font-semibold w-20">
                                    Phone:
                                </Text>
                                <Text className="text-[#113d20] text-[15px] flex-1">
                                    {getSellerPhone()}
                                </Text>
                            </View>
                        )}
                        <View className="flex-row items-center mb-2">
                            <Text className="text-[#113d20] text-[15px] font-semibold w-20">
                                Location:
                            </Text>
                            <Text className="text-[#113d20] text-[15px] flex-1">
                                {getLocationName()}
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View className="mt-4 border-t border-[#e1c56d] pt-4">
                        <Text className="text-[#113d20] text-base font-bold mb-2">
                            Description
                        </Text>
                        <Text className="text-[#113d20] text-[15.5px] leading-tight mb-2 opacity-95">
                            {listing.description || 'No description available.'}
                        </Text>
                    </View>
                </View>

                {/* Contact Seller Button */}
                <TouchableOpacity
                    className="w-[92%] bg-[#113d20] py-4 rounded-xl items-center mb-5 shadow"
                    onPress={handleContactSeller}
                >
                    <Text className="text-white text-lg font-semibold">Contact Seller</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ListingCard;
