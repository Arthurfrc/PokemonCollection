// src/components/Toast.tsx

import React, { useEffect, useRef } from "react"
import { Animated, Text, StyleSheet } from "react-native"

interface ToastProps {
    message: string | null;
    onHide: () => void;
}

export default function Toast({ message, onHide }: ToastProps) {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!message) return;
        Animated.sequence([
            Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.delay(1500),
            Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => onHide());
    }, [message]);

    if (!message) return null;

    return (
        <Animated.View style={[styles.container, { opacity }]}>
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { position: "absolute", bottom: 30, left: 20, right: 20, backgroundColor: "#333", borderRadius: 8, paddingVertical: 12, alignItems: "center" },
    text: { color: "#fff", fontSize: 14, fontWeight: "600" },
});