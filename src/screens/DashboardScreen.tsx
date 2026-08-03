// src/screens/DashboardScreen.tsx

import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useCollectionStats } from "@/hooks/useCollectionStats";

const BAR_COLORS = ["#2f6fed", "#5b8def", "#8bb0f4", "#a5c4f7", "#c3daf9"];

export default function DashboardScreen() {
  const { stats, loading } = useCollectionStats();

  if (loading || !stats) return <ActivityIndicator style={styles.center} />;

  const maxCount = Math.max(...stats.byCollection.map((c) => c.count), 1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.cardsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalCards}</Text>
          <Text style={styles.statLabel}>Cartas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>R$ {stats.totalValue.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Valor estimado</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Distribuição por coleção</Text>
      {stats.byCollection.map((c, index) => (
        <View key={c.name} style={styles.barRow}>
          <Text style={styles.barLabel}>{c.name}</Text>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                { width: `${(c.count / maxCount) * 100}%`, backgroundColor: BAR_COLORS[index % BAR_COLORS.length] },
              ]}
            />
          </View>
          <Text style={styles.barCount}>{c.count}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Cartas mais valiosas</Text>
      {stats.topValueCards.map((c) => (
        <View key={c.id} style={styles.row}>
          <Text style={styles.name}>{c.pokemonName}</Text>
          <Text style={styles.meta}>R$ {(c.estimatedValue ?? 0).toFixed(2)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center" },
  cardsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: "#f2f4f8", borderRadius: 12, padding: 16, alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 12, color: "#666", marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 8, marginBottom: 12 },
  barRow: { marginBottom: 10 },
  barLabel: { fontSize: 13, fontWeight: "600", marginBottom: 4 },
  barTrack: { height: 14, backgroundColor: "#eee", borderRadius: 7, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 7 },
  barCount: { fontSize: 12, color: "#666", marginTop: 2, textAlign: "right" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  name: { fontSize: 15, fontWeight: "600" },
  meta: { fontSize: 14, color: "#666" },
});