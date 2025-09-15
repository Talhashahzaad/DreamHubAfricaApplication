

// import { Ionicons } from "@expo/vector-icons";
// import Constants from "expo-constants";
// import { Link } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//     Image,
//     RefreshControl,
//     ScrollView,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? "https://api.dreamhubafrica.com";

// const Explore = () => {
//     const categories = ["Clothing", "Electronics", "Furniture"];
//     const [products, setProducts] = useState([]);
//     const [query, setQuery] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [refreshing, setRefreshing] = useState(false);

//     const fetchListings = async () => {
//         try {
//             setLoading(true);
//             console.log("Fetching from:", `${API_BASE_URL}/listings`);

//             const response = await fetch(`${API_BASE_URL}/listings`);

//             // Check if the response is ok
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             // Check content type
//             const contentType = response.headers.get("content-type");
//             console.log("Content-Type:", contentType);

//             // Get response text first to debug
//             const responseText = await response.text();
//             console.log("Raw response:", responseText.substring(0, 200)); // First 200 chars

//             // Try to parse JSON
//             let data;
//             try {
//                 data = JSON.parse(responseText);
//             } catch (parseError) {
//                 console.error("JSON Parse Error:", parseError);
//                 console.error("Response was:", responseText);
//                 throw new Error(`Invalid JSON response: ${parseError.message}`);
//             }

//             const listings = Array.isArray(data)
//                 ? data
//                 : Array.isArray(data?.listings)
//                     ? data.listings
//                     : [];

//             console.log("Listings found:", listings.length);

//             const formatted = (listings || []).map((item) => {
//                 const firstImagePath =
//                     Array.isArray(item.images) && item.images.length > 0
//                         ? item.images[0]?.imageUrl || ""
//                         : "";
//                 const loc =
//                     item?.location && typeof item.location === "object"
//                         ? item.location.name ?? ""
//                         : item?.location ?? "";
//                 const price =
//                     typeof item?.price === "object"
//                         ? JSON.stringify(item.price)
//                         : item?.price ?? "";
//                 return {
//                     name: String(item?.title ?? ""),
//                     price: String(price),
//                     location: String(loc),
//                     slug: String(item?.slug ?? ""),
//                     imageUrl: firstImagePath
//                         ? `${API_BASE_URL}${firstImagePath.startsWith("/") ? "" : "/"}${firstImagePath}`
//                         : "",
//                 };
//             });

//             setProducts(formatted);
//             setError(null);
//         } catch (error) {
//             console.error("Error fetching listings:", error);
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchListings();
//     }, []);

//     const onRefresh = async () => {
//         setRefreshing(true);
//         await fetchListings();
//         setRefreshing(false);
//     };

//     const visibleProducts = !query
//         ? products
//         : products.filter((p) =>
//             (p?.name || "").toLowerCase().includes(query.toLowerCase().trim())
//         );

//     return (
//         <SafeAreaView className="flex-1 bg-[#E8B639] px-4">
//             <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={refreshing}
//                         onRefresh={onRefresh}
//                         colors={['#0A4522']}
//                         tintColor="#0A4522"
//                     />
//                 }
//             >
//                 {/* Header */}
//                 <Text className="text-[32px] font-extrabold text-[#0A4522] mt-4 mb-5">
//                     Marketplace
//                 </Text>

//                 {/* Error Display */}
//                 {error && (
//                     <View className="bg-red-100 p-4 rounded-xl mb-4">
//                         <Text className="text-red-800 text-center">
//                             Error: {error}
//                         </Text>
//                     </View>
//                 )}

//                 {/* Loading Display */}
//                 {loading && (
//                     <View className="py-8">
//                         <Text className="text-[#0A4522] text-center text-lg">
//                             Loading listings...
//                         </Text>
//                     </View>
//                 )}

//                 {/* Search Bar */}
//                 <View className="flex-row items-center bg-[#FCE89E] rounded-2xl px-4 py-3 mb-5">
//                     <Ionicons name="search-outline" size={20} color="#0A4522" />
//                     <TextInput
//                         placeholder="Search"
//                         placeholderTextColor="#0A4522"
//                         className="ml-2 flex-1 text-[#0A4522] text-[18px]"
//                         value={query}
//                         onChangeText={setQuery}
//                     />
//                 </View>

//                 {/* Categories */}
//                 <View className="flex-row flex-wrap mb-6">
//                     {categories.map((cat, index) => (
//                         <TouchableOpacity
//                             key={index}
//                             className="bg-[#FCE89E] px-5 py-2 rounded-xl mr-3 mb-3"
//                         >
//                             <Text className="text-[#0A4522] text-[18px]">{cat}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 {/* Product Grid (API data) - Now Clickable */}
//                 <View className="flex-row flex-wrap justify-between">
//                     {visibleProducts.length === 0 && !loading ? (
//                         <View className="w-full py-8">
//                             <Text className="text-[#0A4522] text-center text-lg">
//                                 No listings found
//                             </Text>
//                         </View>
//                     ) : (
//                         visibleProducts.map((item, index) => (
//                             <Link
//                                 key={index}
//                                 href={`/single-listing/${item.slug}`}
//                                 asChild
//                             >
//                                 <TouchableOpacity
//                                     className="bg-[#FCE89E] w-[48%] rounded-2xl p-6 mb-6 items-center"
//                                     activeOpacity={0.7}
//                                 >
//                                     <Image
//                                         source={
//                                             item.imageUrl
//                                                 ? { uri: item.imageUrl }
//                                                 : require("../../../assets/images/sofa.png")
//                                         }
//                                         className="w-16 h-16 mb-4"
//                                         resizeMode="contain"
//                                     />
//                                     <Text className="text-[18px] font-bold text-black mb-1">
//                                         {item.name || "Untitled"}
//                                     </Text>
//                                     <Text className="text-[18px] text-black mb-1">
//                                         {item.price || ""} (GMD)
//                                     </Text>
//                                     <Text className="text-[16px] text-black">
//                                         {item.location || ""}
//                                     </Text>
//                                 </TouchableOpacity>
//                             </Link>
//                         ))
//                     )}
//                 </View>

//                 {/* Bottom Home Button */}
//                 <TouchableOpacity className="bg-[#0A4522] py-4 rounded-2xl items-center mt-2 mb-20">
//                     <Link href="/">
//                         <Text className="text-white font-bold text-[20px]">Home</Text>
//                     </Link>
//                 </TouchableOpacity>
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// export default Explore;
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? "https://api.dreamhubafrica.com";

const Explore = () => {
    const categories = ["Clothing", "Electronics", "Furniture"];
    const [products, setProducts] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const formatPrice = (priceRaw: any) => {
        if (priceRaw === null || typeof priceRaw === "undefined") return "";

        // Try to extract a numeric value first
        const str = String(priceRaw);
        const numeric = Number(str.replace(/[^0-9.-]+/g, ""));

        if (!Number.isFinite(numeric)) {
            // not a number -> return raw value
            return str;
        }

        // Format with thousands separator and prefix D
        try {
            const formatted = new Intl.NumberFormat("en-US").format(numeric);
            return `D${formatted}`;
        } catch {
            // fallback
            return `D${numeric.toLocaleString()}`;
        }
    };

    const fetchListings = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching from:", `${API_BASE_URL}/listings`);

            const response = await fetch(`${API_BASE_URL}/listings`);

            // Check if the response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Get response text first to debug
            const responseText = await response.text();
            console.log("Raw response:", responseText.substring(0, 200)); // First 200 chars

            // Try to parse JSON
            let data: any;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error("JSON Parse Error:", parseError);
                console.error("Response was:", responseText);
                throw new Error(`Invalid JSON response: ${parseError.message}`);
            }

            const listings = Array.isArray(data)
                ? data
                : Array.isArray(data?.listings)
                    ? data.listings
                    : [];

            console.log("Listings found:", listings.length);

            const formatted = (listings || []).map((item: any) => {
                const firstImagePath =
                    Array.isArray(item.images) && item.images.length > 0
                        ? item.images[0]?.imageUrl || item.images[0]?.url || ""
                        : "";
                const loc =
                    item?.location && typeof item.location === "object"
                        ? item.location.name ?? ""
                        : item?.location ?? "";
                const price =
                    typeof item?.price === "object"
                        ? item.price.amount ?? item.price.value ?? JSON.stringify(item.price)
                        : item?.price ?? "";

                return {
                    name: String(item?.title ?? ""),
                    price: price,
                    location: String(loc),
                    slug: String(item?.slug ?? ""),
                    imageUrl: firstImagePath
                        ? `${API_BASE_URL}${firstImagePath.startsWith("/") ? "" : "/"}${firstImagePath}`
                        : "",
                };
            });

            setProducts(formatted);
            setError(null);
        } catch (err: any) {
            console.error("Error fetching listings:", err);
            setError(err?.message || "Error fetching listings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchListings();
        setRefreshing(false);
    };

    const visibleProducts =
        !query
            ? products
            : products.filter((p) => (p?.name || "").toLowerCase().includes(query.toLowerCase().trim()));

    return (
        <SafeAreaView className="flex-1 bg-[#E8B639] px-4">
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0A4522"]} tintColor="#0A4522" />
                }
            >
                {/* Header */}
                <Text className="text-[32px] font-extrabold text-[#0A4522] mt-4 mb-5">Marketplace</Text>

                {/* Error Display */}
                {error && (
                    <View className="bg-red-100 p-4 rounded-xl mb-4">
                        <Text className="text-red-800 text-center">Error: {error}</Text>
                    </View>
                )}

                {/* Loading Display */}
                {loading && (
                    <View className="py-8">
                        <Text className="text-[#0A4522] text-center text-lg">Loading listings...</Text>
                    </View>
                )}

                {/* Search Bar */}
                <View className="flex-row items-center bg-[#FCE89E] rounded-2xl px-4 py-3 mb-5">
                    <Ionicons name="search-outline" size={20} color="#0A4522" />
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor="#0A4522"
                        className="ml-2 flex-1 text-[#0A4522] text-[18px]"
                        value={query}
                        onChangeText={setQuery}
                    />
                </View>

                {/* Categories */}
                {/* <View className="flex-row flex-wrap mb-6">
                    {categories.map((cat, index) => (
                        <TouchableOpacity key={index} className="bg-[#FCE89E] px-5 py-2 rounded-xl mr-3 mb-3">
                            <Text className="text-[#0A4522] text-[18px]">{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </View> */}

                {/* Product Grid */}
                <View className="flex-row flex-wrap justify-between">
                    {visibleProducts.length === 0 && !loading ? (
                        <View className="w-full py-8">
                            <Text className="text-[#0A4522] text-center text-lg">No listings found</Text>
                        </View>
                    ) : (
                        visibleProducts.map((item, index) => (
                            <Link key={index} href={`/single-listing/${item.slug}`} asChild>
                                <TouchableOpacity
                                    className="bg-[#FCE89E] w-[48%] rounded-2xl p-3 mb-6"
                                    activeOpacity={0.85}
                                >
                                    {/* IMAGE: made the main focus (full width, taller) */}
                                    <View className="w-full h-36 mb-3 overflow-hidden rounded-lg bg-white items-center justify-center">
                                        <Image
                                            source={item.imageUrl ? { uri: item.imageUrl } : require("../../../assets/images/sofa.png")}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    </View>

                                    {/* Title (slightly smaller so image stands out) */}
                                    <Text className="text-[16px] font-medium text-[#0A4522] mb-1" numberOfLines={2}>
                                        {item.name || "Untitled"}
                                    </Text>

                                    {/* Price (consistent formatting and prominent color) */}
                                    <Text className="text-[16px] font-bold text-[#0A4522] mb-1">
                                        {formatPrice(item.price)} {item.price ? "" : ""}
                                    </Text>

                                    {/* Location */}
                                    <Text className="text-[14px] text-[#0A4522] opacity-80">{item.location || ""}</Text>
                                </TouchableOpacity>
                            </Link>
                        ))
                    )}
                </View>

                {/* Bottom Home Button */}
                <TouchableOpacity className="bg-[#0A4522] py-4 rounded-2xl items-center mt-2 mb-20">
                    <Link href="/">
                        <Text className="text-white font-bold text-[20px]">Home</Text>
                    </Link>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Explore;
