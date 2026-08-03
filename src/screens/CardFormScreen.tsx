// src/screens/CardFormScreen.tsx

import React, { useEffect, useState } from "react";
import { View, TextInput, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { createCard, updateCard, deleteCard, getCardById } from "@/services/supabase/cardsService";
import { CardCondition } from "@/types/cards";
import { RootStackParamList } from "@/navigation/RootNavigator";

const CONDITIONS: CardCondition[] = ["N", "SP", "MP", "HP", "NM"];

type FormRoute = RouteProp<RootStackParamList, "CardForm">;

export default function CardFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<FormRoute>();
  const cardId = route.params?.cardId;
  const isEditing = !!cardId;

  const [pokemonName, setPokemonName] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [language, setLanguage] = useState("PT-BR");
  const [condition, setCondition] = useState<CardCondition>("NM");
  const [quantity, setQuantity] = useState("1");
  const [paidPrice, setPaidPrice] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    navigation.setOptions({ title: isEditing ? "Editar carta" : "Nova carta" });
    if (!cardId) return;
    getCardById(cardId)
      .then((card) => {
        setPokemonName(card.pokemonName);
        setCollectionName(card.collectionName);
        setCardCode(card.cardCode);
        setLanguage(card.language);
        setCondition(card.condition);
        setQuantity(String(card.quantity));
        setPaidPrice(card.paidPrice != null ? String(card.paidPrice) : "");
        setEstimatedValue(card.estimatedValue != null ? String(card.estimatedValue) : "");
        setImageUrl(card.imageUrl ?? "");
      })
      .catch((err) => Alert.alert("Erro ao carregar", String(err)))
      .finally(() => setLoading(false));
  }, [cardId]);

  function buildPayload() {
    return {
      pokemonName,
      collectionName,
      cardCode,
      language,
      condition,
      quantity: Number(quantity) || 1,
      paidPrice: paidPrice ? Number(paidPrice) : null,
      estimatedValue: estimatedValue ? Number(estimatedValue) : null,
      imageUrl: imageUrl || null,
    };
  }

  async function handleSave() {
    if (!pokemonName || !collectionName || !cardCode) {
      Alert.alert("Campos obrigatórios", "Preencha nome, coleção e código da carta.");
      return;
    }
    setSaving(true);
    try {
      if (isEditing) {
        await updateCard(cardId!, buildPayload());
      } else {
        await createCard(buildPayload());
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro ao salvar", String(err));
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    Alert.alert("Excluir carta", "Tem certeza que deseja excluir esta carta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCard(cardId!);
            navigation.goBack();
          } catch (err) {
            Alert.alert("Erro ao excluir", String(err));
          }
        },
      },
    ]);
  }

  if (loading) return <Text style={styles.loadingText}>Carregando...</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Nome do Pokémon</Text>
      <TextInput style={styles.input} value={pokemonName} onChangeText={setPokemonName} placeholder="Pikachu" />

      <Text style={styles.label}>Coleção / Expansão</Text>
      <TextInput style={styles.input} value={collectionName} onChangeText={setCollectionName} placeholder="Base Set" />

      <Text style={styles.label}>Código da carta</Text>
      <TextInput style={styles.input} value={cardCode} onChangeText={setCardCode} placeholder="58/102" />

      <Text style={styles.label}>Idioma</Text>
      <TextInput style={styles.input} value={language} onChangeText={setLanguage} placeholder="PT-BR" />

      <Text style={styles.label}>Condição</Text>
      <View style={styles.conditionRow}>
        {CONDITIONS.map((c) => (
          <Pressable key={c} onPress={() => setCondition(c)} style={[styles.chip, condition === c && styles.chipActive]}>
            <Text style={[styles.chipText, condition === c && styles.chipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Quantidade</Text>
      <View style={styles.quantityRow}>
        <Pressable style={styles.qtyButton} onPress={() => setQuantity(String(Math.max(1, Number(quantity) - 1)))}>
          <Text style={styles.qtyButtonText}>-</Text>
        </Pressable>
        <TextInput style={styles.qtyInput} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
        <Pressable style={styles.qtyButton} onPress={() => setQuantity(String(Number(quantity) + 1))}>
          <Text style={styles.qtyButtonText}>+</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Preço pago (R$)</Text>
      <TextInput style={styles.input} value={paidPrice} onChangeText={setPaidPrice} keyboardType="decimal-pad" placeholder="0.00" />

      <Text style={styles.label}>Valor estimado (R$)</Text>
      <TextInput style={styles.input} value={estimatedValue} onChangeText={setEstimatedValue} keyboardType="decimal-pad" placeholder="0.00" />

      <Text style={styles.label}>URL da imagem</Text>
      <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="https://..." autoCapitalize="none" />

      <Pressable style={styles.saveButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? "Salvando..." : "Salvar carta"}</Text>
      </Pressable>

      {isEditing && (
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Excluir carta</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  loadingText: { padding: 16, fontSize: 14, color: "#666" },
  label: { fontSize: 13, fontWeight: "600", color: "#444", marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
  conditionRow: { flexDirection: "row", gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#ccc" },
  chipActive: { backgroundColor: "#2f6fed", borderColor: "#2f6fed" },
  chipText: { fontSize: 13, color: "#444" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  quantityRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  qtyButton: { width: 40, height: 40, borderRadius: 8, backgroundColor: "#f2f4f8", alignItems: "center", justifyContent: "center" },
  qtyButtonText: { fontSize: 20, fontWeight: "700" },
  qtyInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, textAlign: "center", paddingVertical: 10, fontSize: 15 },
  saveButton: { backgroundColor: "#2f6fed", borderRadius: 8, paddingVertical: 14, alignItems: "center", marginTop: 24 },
  saveButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  deleteButton: { borderRadius: 8, paddingVertical: 14, alignItems: "center", marginTop: 12, borderWidth: 1, borderColor: "#e53935" },
  deleteButtonText: { color: "#e53935", fontWeight: "700", fontSize: 15 },
});