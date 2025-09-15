import AsyncStorage from "@react-native-async-storage/async-storage";

let memoryToken: string | null = null;

export async function setToken(token: string) {
    // Always clean before saving
    let clean = String(token)
        .replace(/^\s*"|"\s*$/g, "") // strip quotes if JSON-stringified
        .replace(/[\r\n\t]/g, "")    // strip hidden chars
        .trim();

    memoryToken = clean;
    await AsyncStorage.setItem("token", clean);
}

export async function getToken(): Promise<string | null> {
    if (memoryToken) return memoryToken;

    const t = await AsyncStorage.getItem("token");
    if (!t) return null;

    // Clean on retrieval too, just in case
    let clean = String(t)
        .replace(/^\s*"|"\s*$/g, "")
        .replace(/[\r\n\t]/g, "")
        .trim();

    memoryToken = clean;
    return clean;
}

export async function clearToken() {
    memoryToken = null;
    await AsyncStorage.removeItem("token");
}
