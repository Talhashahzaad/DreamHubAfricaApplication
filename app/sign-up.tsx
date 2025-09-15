import Constants from "expo-constants";
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? "https://api.dreamhubafrica.com";

const SignUp = () => {
    const router = useRouter();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Validation helpers
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isStrongPassword = (str) => {
        // At least one uppercase letter, one number, one special char, minimum 6 chars
        const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}[\]|:;"'<>,.?/~`]).{6,}$/;
        return strongPasswordRegex.test(str);
    };

    // ✅ Normalize + validate Gambian phone numbers only
    const normalizePhone = (phone) => {
        let cleaned = phone.replace(/\s|-/g, ''); // remove spaces/dashes

        // If starts with +220
        if (cleaned.startsWith('+220')) {
            const localPart = cleaned.slice(4);
            if (/^\d{7,10}$/.test(localPart)) {
                return `+220${localPart}`;
            }
            return null;
        }

        // If starts with 220
        if (cleaned.startsWith('220')) {
            const localPart = cleaned.slice(3);
            if (/^\d{7,10}$/.test(localPart)) {
                return `+220${localPart}`;
            }
            return null;
        }

        // If just digits 7–10 → treat as local Gambian
        if (/^\d{7,10}$/.test(cleaned)) {
            return `+220${cleaned}`;
        }

        return null; // ❌ invalid
    };

    // ✅ Auto-format Gambian phone
    const handlePhoneChange = (text) => {
        let cleaned = text.replace(/\s|-/g, '');

        // Always enforce +220 prefix
        if (cleaned.startsWith('+220')) {
            setPhone(cleaned.slice(0, 14)); // +220 + up to 10 digits
        } else if (cleaned.startsWith('220')) {
            setPhone(`+220${cleaned.slice(3, 13)}`);
        } else if (/^\d{7,10}$/.test(cleaned)) {
            setPhone(`+220${cleaned}`);
        } else {
            setPhone(cleaned); // let user type, validation will catch invalid
        }
    };
    const handleSignUp = async () => {
        let errors = [];

        if (!name.trim()) errors.push({ field: 'name', message: 'Name is required' });

        if (!email) {
            errors.push({ field: 'email', message: 'Email is required' });
        } else if (!isValidEmail(email)) {
            errors.push({ field: 'email', message: 'Invalid email format' });
        }

        let normalizedPhone = null;
        if (!phone) {
            errors.push({ field: 'phone', message: 'Phone is required' });
        } else {
            normalizedPhone = normalizePhone(phone);
            if (!normalizedPhone) {
                errors.push({
                    field: 'phone',
                    message:
                        'DreamHub Africa is currently available only in The Gambia 🇬🇲. Phone must start with +220 and have 7–10 digits.',
                });
            }
        }

        if (!password) {
            errors.push({ field: 'password', message: 'Password is required' });
        } else if (!isStrongPassword(password)) {
            errors.push({
                field: 'password',
                message:
                    'Password must be at least 6 characters, include one uppercase letter, one number, and one special character',
            });
        }

        if (errors.length > 0) {
            Alert.alert('Validation Error', errors.map(e => e.message).join('\n'));
            return;
        }

        // ✅ Strip +220 before sending to DB
        const phoneForDB = normalizedPhone.startsWith('+220')
            ? normalizedPhone.slice(4)
            : normalizedPhone;

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone: phoneForDB, password }),
            });

            const data = await response.json();
            console.log('API Response:', data);

            if (response.ok) {
                Alert.alert('Success', 'Registration successful!', [
                    { text: 'OK', onPress: () => router.replace('/sign-in') },
                ]);
            } else {
                const errorMsg = data.error || data.message || 'Registration failed';
                Alert.alert('Registration failed', errorMsg);
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#D7A73D] px-5">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerClassName="items-center">

                    {/* Logo */}
                    <Image
                        source={require('../assets/images/logo.png')}
                        className="w-[250px] h-[250px]"
                        resizeMode="contain"
                    />

                    {/* Title */}
                    <Text className="text-[42px] font-bold text-[#333] mb-10">
                        Register Here!
                    </Text>

                    {/* Name */}
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Name"
                        placeholderTextColor="#333"
                        className="w-full h-[50px] border border-[#ddd] rounded-lg px-4 mb-4 text-base bg-[#fff5b8]"
                    />

                    {/* Email */}
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor="#333"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="w-full h-[50px] border border-[#ddd] rounded-lg px-4 mb-4 text-base bg-[#fff5b8]"
                    />

                    {/* Phone */}
                    <TextInput
                        value={phone}
                        onChangeText={handlePhoneChange} // ✅ auto-format handler
                        placeholder="Phone"
                        placeholderTextColor="#333"
                        keyboardType="phone-pad"
                        maxLength={14} // +220 + 10 digits max
                        className="w-full h-[50px] border border-[#ddd] rounded-lg px-4 mb-4 text-base bg-[#fff5b8]"
                    />

                    {/* Password */}
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry
                        placeholderTextColor="#333"
                        className="w-full h-[50px] border border-[#ddd] rounded-lg px-4 mb-4 text-base bg-[#fff5b8]"
                    />

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        className="w-full bg-[#123d22] p-4 rounded-lg items-center mb-4"
                        onPress={handleSignUp}
                        disabled={loading}
                    >
                        <Text className="text-white text-lg">{loading ? 'Registering...' : 'Sign Up'}</Text>
                    </TouchableOpacity>

                    {/* Login Link */}
                    <TouchableOpacity>
                        <Text className="text-[#123d22] text-base mb-5">
                            Have an account? <Link href="/sign-in">Login</Link>
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUp;
