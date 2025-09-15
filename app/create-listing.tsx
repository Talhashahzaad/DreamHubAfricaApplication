import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { clearToken, getToken } from "./lib/auth";

const API_BASE_URL =
    Constants.expoConfig?.extra?.API_BASE_URL ?? "https://api.dreamhubafrica.com";

const API_URL = `${API_BASE_URL}/listings`;
const CATEGORY_URL = `${API_BASE_URL}/categories`;
const LOCATION_URL = `${API_BASE_URL}/locations`;

/* ---------- helper to clean token (same pattern as your ProfileScreen) ---------- */
async function getCleanToken(): Promise<string | null> {
    let token = await getToken();
    if (!token) return null;

    token = String(token)
        .replace(/^\s*"|"\s*$/g, "") // strip surrounding quotes
        .replace(/[\r\n\t]/g, "") // remove hidden newline/tab chars
        .trim();

    return token || null;
}

/* ---------- Image picker section (unchanged except thumbnails are non-clickable) ---------- */
const MultiImagePickerSection = ({
    images,
    setImages,
    selectedIndex,
    setSelectedIndex,
}: {
    images: any[];
    setImages: (v: any[]) => void;
    selectedIndex: number;
    setSelectedIndex: (i: number) => void;
}) => {
    const pickImages = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission required", "We need photo library access.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
            selectionLimit: 5,
        });

        if (!result.canceled && result.assets?.length) {
            if (result.assets.length > 5) {
                Alert.alert("Limit reached", "You can only upload up to 5 images.");
                return;
            }

            setImages(
                result.assets.map((asset, idx) => ({
                    uri: asset.uri,
                    fileName:
                        asset.fileName || asset.uri.split("/").pop() || `photo_${Date.now()}_${idx}.jpg`,
                    mimeType: asset.mimeType || "image/jpeg",
                }))
            );
            setSelectedIndex(0);
        }
    };

    return (
        <View className="mb-2 w-full items-center">
            <TouchableOpacity
                onPress={pickImages}
                className="w-[185px] h-[185px] bg-[#184528] rounded-2xl items-center justify-center mb-3 shadow-sm"
                activeOpacity={0.85}
                style={{ alignSelf: "center" }}
            >
                {images.length > 0 ? (
                    <Image
                        source={{ uri: images[selectedIndex]?.uri }}
                        className="w-[170px] h-[170px] rounded-xl"
                        resizeMode="cover"
                    />
                ) : (
                    <Image
                        source={require("../assets/images/editpost.png")}
                        className="w-[60px] h-[60px]"
                        resizeMode="contain"
                    />
                )}
            </TouchableOpacity>

            {images.length > 1 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2 max-w-[95%]">
                    {images.map((img, idx) => (
                        // <-- Changed Pressable -> View so thumbnails are NOT clickable
                        <View
                            key={`${img.uri}-${idx}`}
                            className={`mx-1 rounded-lg ${selectedIndex === idx ? "ring-2 ring-[#184528]" : ""}`}
                        >
                            <Image source={{ uri: img.uri }} className="w-12 h-12 rounded-lg" resizeMode="cover" />
                        </View>
                    ))}
                </ScrollView>
            )}

            {images.length > 0 && (
                <Text className="text-sm text-[#084325] font-semibold">{images.length}/5 images selected</Text>
            )}
        </View>
    );
};

/* ---------- Main Screen ---------- */
const PostItem = () => {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<any[]>([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const [location, setLocation] = useState("");
    const [locationId, setLocationId] = useState("");
    const [locations, setLocations] = useState<any[]>([]);
    const [showLocationModal, setShowLocationModal] = useState(false);

    const [description, setDescription] = useState("");
    const [images, setImages] = useState<any[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    // user state (logged-in user's profile)
    const [user, setUser] = useState<any | null>(null);
    const [userLoading, setUserLoading] = useState(true);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch(CATEGORY_URL);
            const txt = await res.text();
            setCategories(txt ? JSON.parse(txt) : []);
        } catch {
            Alert.alert("Error", "Could not load categories.");
        }
    }, []);

    // Fetch locations
    const fetchLocations = useCallback(async () => {
        try {
            const res = await fetch(LOCATION_URL);
            const txt = await res.text();
            setLocations(txt ? JSON.parse(txt) : []);
        } catch {
            Alert.alert("Error", "Could not load locations.");
        }
    }, []);

    useEffect(() => {
        fetchCategories();
        fetchLocations();
        // fetch current user on mount
        fetchCurrentUser();
    }, [fetchCategories, fetchLocations]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([fetchCategories(), fetchLocations(), fetchCurrentUser()]);
            setTitle("");
            setPrice("");
            setCategory("");
            setCategoryId("");
            setLocation("");
            setLocationId("");
            setDescription("");
            setImages([]);
            setSelectedIndex(0);
        } finally {
            setRefreshing(false);
        }
    }, [fetchCategories, fetchLocations]);

    // Fetch the logged-in user's details (uses same pattern as ProfileScreen)
    async function fetchCurrentUser() {
        setUserLoading(true);
        try {
            const token = await getCleanToken();
            if (!token) {
                setUser(null);
                setUserLoading(false);
                return;
            }

            // adjust endpoint to what your server exposes (ProfileScreen used /user/profile)
            const res = await fetch(`${API_BASE_URL}/user/profile`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401) {
                // token expired -> clear and redirect user
                await clearToken();
                setUser(null);
                setUserLoading(false);
                router.replace("/sign-in");
                return;
            }

            if (!res.ok) {
                // not fatal for UI, but keep user null
                console.warn("fetchCurrentUser failed", res.status);
                setUser(null);
                setUserLoading(false);
                return;
            }

            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.warn("fetchCurrentUser err:", err);
            setUser(null);
        } finally {
            setUserLoading(false);
        }
    }

    const handleSubmit = async () => {
        if (!title.trim() || !price.trim() || !category || !description.trim() || !location || images.length < 1) {
            Alert.alert("Missing Info", images.length < 1 ? "Please add at least one image." : "Please fill out all fields.");
            return;
        }

        if (images.length > 5) {
            Alert.alert("Too many images", "You can only upload up to 5 images.");
            return;
        }

        const token = await getCleanToken();
        if (!token) {
            Alert.alert("Auth", "Please log in again.");
            router.replace("/sign-in");
            return;
        }

        setSubmitting(true);
        try {
            // Ensure we have the latest user data before submit (refresh if needed)
            if (!user) {
                await fetchCurrentUser();
            } else {
                // optional: you can re-fetch to be 100% sure
                // await fetchCurrentUser();
            }

            // Now check verification: if user still null or isVerified false => block
            if (!user) {
                // If we couldn't fetch user for some reason, show friendly message
                Alert.alert("Could not confirm account status", "Please try again.");
                setSubmitting(false);
                return;
            }

            if (!user.isVerified) {
                Alert.alert("Only verified users can post items.");
                setSubmitting(false);
                return;
            }

            // Build FormData and submit
            const fd = new FormData();
            fd.append("title", title.trim());
            fd.append("price", String(Number(price)));
            fd.append("description", description.trim());
            fd.append("location", locationId || location);
            fd.append("category", categoryId || category);

            images.forEach((img, idx) => {
                fd.append("images", {
                    uri: img.uri,
                    name: img.fileName || `photo_${idx}.jpg`,
                    type: img.mimeType || "image/jpeg",
                } as any);
            });

            const res = await fetch(`${API_BASE_URL}/listings`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: fd,
            });

            if (!res.ok) {
                const msg = `Upload failed (${res.status})`;
                throw new Error(msg);
            }

            Alert.alert("Success", "Your item was posted!", [
                {
                    text: "OK",
                    onPress: () => {
                        router.replace("/(root)/(tabs)/explore?refresh=1");
                    },
                },
            ]);
        } catch (e: any) {
            console.warn("submit err:", e);
            Alert.alert("Error", e?.message || "Could not submit. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#D7A73D" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#D7A73D" translucent={false} />
            <SafeAreaView className="flex-1 bg-[#E8B639] px-5">
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{ alignItems: "center", paddingBottom: 32 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#184528" colors={["#184528"]} />}
                    >
                        <Text className="text-[34px] font-bold text-[#205221] mt-7 mb-4">Post an Item</Text>

                        <MultiImagePickerSection images={images} setImages={setImages} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />

                        {/* Title */}
                        <TextInput className="w-full h-[51px] bg-[#fff5b8] rounded-xl px-5 mb-4 text-base text-[#084325] font-semibold" placeholder="Title" value={title} placeholderTextColor="#084325" onChangeText={setTitle} />

                        {/* Price */}
                        <TextInput className="w-full h-[51px] bg-[#fff5b8] rounded-xl px-5 mb-4 text-base text-[#084325] font-semibold" placeholder="Price" value={price} placeholderTextColor="#084325" onChangeText={setPrice} keyboardType="numeric" />

                        {/* Category Dropdown */}
                        <TouchableOpacity className="w-full h-[51px] bg-[#fff5b8] font-semibold rounded-xl px-5 flex-row items-center justify-between mb-4" onPress={() => setShowCategoryModal(true)} activeOpacity={0.9}>
                            <Text className={`text-base ${category ? "text-[#084325]" : "text-[#084325]"}`}>{category ? category : "Select Category"}</Text>
                            <Text className="text-lg text-[#084325]">▼</Text>
                        </TouchableOpacity>

                        {/* Category Modal */}
                        <Modal visible={showCategoryModal} transparent animationType="slide" onRequestClose={() => setShowCategoryModal(false)}>
                            <Pressable className="flex-1 justify-end bg-black/30" onPress={() => setShowCategoryModal(false)}>
                                <View className="bg-white rounded-t-xl pb-6 pt-4 px-4">
                                    <Text className="text-lg text-[#084325] font-semibold mb-4">Select Category</Text>
                                    <FlatList data={categories} keyExtractor={(item: any) => item._id} renderItem={({ item }) => (
                                        <TouchableOpacity className="py-3 px-1 border-b border-[#eee]" onPress={() => { setCategory(item.name); setCategoryId(item._id); setShowCategoryModal(false); }}>
                                            <Text className="text-base font-semibold text-[#084325]">{item.name}</Text>
                                        </TouchableOpacity>
                                    )} />
                                    <TouchableOpacity className="mt-3 items-center" onPress={() => setShowCategoryModal(false)}><Text className="text-[#084325] font-semibold text-base">Cancel</Text></TouchableOpacity>
                                </View>
                            </Pressable>
                        </Modal>

                        {/* Location Dropdown */}
                        <TouchableOpacity className="w-full h-[51px] bg-[#fff5b8] rounded-xl  px-5 flex-row items-center justify-between mb-4" onPress={() => setShowLocationModal(true)} activeOpacity={0.9}>
                            <Text className={`text-base ${location ? "text-[#084325]" : "text-[#084325]"}`}>{location ? location : "Select Location"}</Text>
                            <Text className="text-lg text-[#084325]">▼</Text>
                        </TouchableOpacity>

                        {/* Location Modal */}
                        <Modal visible={showLocationModal} transparent animationType="slide" onRequestClose={() => setShowLocationModal(false)}>
                            <Pressable className="flex-1 justify-end  bg-black/30" onPress={() => setShowLocationModal(false)}>
                                <View className="bg-white rounded-t-xl pb-6 pt-4 px-4">
                                    <Text className="text-lg text-[#084325] font-semibold mb-4">Select Location</Text>
                                    <FlatList data={locations} keyExtractor={(item: any) => item._id} renderItem={({ item }) => (
                                        <TouchableOpacity className="py-3 px-1 border-b  border-[#eee] " onPress={() => { setLocation(item.name); setLocationId(item._id); setShowLocationModal(false); }}>
                                            <Text className="text-base font-semibold text-[#084325]">{item.name}</Text>
                                        </TouchableOpacity>
                                    )} />
                                    <TouchableOpacity className="mt-3 items-center" onPress={() => setShowLocationModal(false)}><Text className="text-[#084325] font-semibold text-base">Cancel</Text></TouchableOpacity>
                                </View>
                            </Pressable>
                        </Modal>

                        {/* Description */}
                        <TextInput className="w-full bg-[#fff5b8] rounded-xl font-semibold px-5 py-[13px] text-base text-[#084325] mb-4" style={{ minHeight: 90, textAlignVertical: "top" }} multiline numberOfLines={3} placeholderTextColor="#084325" placeholder="Description" value={description} onChangeText={setDescription} />

                        {/* Submit */}
                        <TouchableOpacity className={`w-full bg-[#184528] h-[57px] rounded-xl items-center justify-center mt-2 mb-2 ${submitting ? "opacity-70" : ""}`} disabled={submitting} onPress={handleSubmit}>
                            {submitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-[18px] font-bold">Post</Text>}
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

export default PostItem;

