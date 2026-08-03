// src/screens/CollectionScreen.tsx

import React, { useCallback, useMemo, useState } from "react";
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Pressable, Alert, TextInput } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getCards, deleteCard } from "@/services/supabase/cardsService";
import { Card } from "@/types/cards";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { cardCodeMatches } from "@/utils/cardCode";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CollectionScreen() {
    const navigation = useNavigation<Nav>();
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [nameQuery, setNameQuery] = useState("");
    const [codeQuery, setCodeQuery] = useState("");

    const loadCards = useCallback(() => {
        setLoading(true);
        getCards().then(setCards).finally(() => setLoading(false));
    }, []);

    useFocusEffect(loadCards);

    const filteredCards = useMemo(() => {
        const nameFilter = nameQuery.trim().toLowerCase();
        const codeFilter = codeQuery.trim();

        return cards.filter((card) => {
            const matchesName = !nameFilter || card.pokemonName.toLowerCase().includes(nameFilter);
            const matchesCode = !codeFilter || cardCodeMatches(card.cardCode, codeFilter);
            return matchesName && matchesCode;
        });
    }, [cards, nameQuery, codeQuery]);

    function handleLongPress(card: Card) {
        Alert.alert(card.pokemonName, "O que deseja fazer?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Editar", onPress: () => navigation.navigate("CardForm", { cardId: card.id }) },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    await deleteCard(card.id);
                    loadCards();
                },
            },
        ]);
    }

    if (loading) return <ActivityIndicator style={styles.center} />;

    return (
        <View style={styles.container}>
            <View style={styles.searchArea}>
                <TextInput
                    style={styles.searchInput}
                    value={nameQuery}
                    onChangeText={setNameQuery}
                    placeholder="Buscar por nome (ex: Pikachu)"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.searchInput}
                    value={codeQuery}
                    onChangeText={setCodeQuery}
                    placeholder="Buscar por código (ex: 5/101)"
                    autoCapitalize="none"
                />
            </View>

            <FlatList
                data={filteredCards}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.row}
                        onPress={() => navigation.navigate("CardForm", { cardId: item.id })}
                        onLongPress={() => handleLongPress(item)}
                    >
                        <View style={styles.rowInfo}>
                            <Text style={styles.name}>{item.pokemonName}</Text>
                            <Text style={styles.meta}>{item.collectionName} · {item.cardCode} · {item.condition} · x{item.quantity}</Text>
                        </View>
                        {item.estimatedValue != null && <Text style={styles.value}>R$ {item.estimatedValue.toFixed(2)}</Text>}
                    </Pressable>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Nenhuma carta encontrada.</Text>}
            />
            <Pressable style={styles.fab} onPress={() => navigation.navigate("CardForm", {})}>
                <Text style={styles.fabText}>+</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: "center" },
    searchArea: { padding: 16, paddingBottom: 8, gap: 8 },
    searchInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
    list: { paddingHorizontal: 16 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
    rowInfo: { flex: 1 },
    name: { fontSize: 16, fontWeight: "600" },
    meta: { fontSize: 13, color: "#666" },
    value: { fontSize: 14, fontWeight: "700", color: "#2f6fed" },
    empty: { textAlign: "center", color: "#999", marginTop: 40 },
    fab: { position: "absolute", right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: "#2f6fed", alignItems: "center", justifyContent: "center", elevation: 4 },
    fabText: { color: "#fff", fontSize: 28, lineHeight: 28 },
});