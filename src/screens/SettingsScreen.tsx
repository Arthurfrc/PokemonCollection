// src/screens/SettingsScreen.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <Text style={styles.hint}>Login com Google e sincronização entrarão aqui quando ativados.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  hint: { fontSize: 13, color: "#666" },
});