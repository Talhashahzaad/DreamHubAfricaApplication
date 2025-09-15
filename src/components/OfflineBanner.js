// src/components/OfflineBanner.js
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function OfflineBanner() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container} pointerEvents="auto">
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.message}>
          You are offline. Check your connection — the app will reconnect automatically.
        </Text>
        <Pressable onPress={() => { /* optional manual retry; NetInfo updates automatically */ }} style={styles.btn}>
          <Text style={styles.btnText}>Retry</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  container: {
    width: '86%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#FFEEAE',
    alignItems: 'center',
    elevation: 6,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  message: { textAlign: 'center', marginBottom: 16 },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#074224',
  },
  btnText: { color: 'white', fontWeight: '600' },
});
